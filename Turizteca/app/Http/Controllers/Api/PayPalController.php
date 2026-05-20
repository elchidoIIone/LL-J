<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\SponsorshipConfirmationEmail;
use App\Models\Restaurant;
use App\Models\Sponsorship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class PayPalController extends Controller
{
    // Canonical prices per tier (USD) — never trusted from the client
    private const TIER_PRICES = [
        'basic'    => '10.00',
        'featured' => '25.00',
        'premium'  => '50.00',
    ];

    private const TIER_LABELS = [
        'basic'    => 'Básico',
        'featured' => 'Destacado',
        'premium'  => 'Premium',
    ];

    private string $baseUrl;
    private string $clientId;
    private string $clientSecret;

    public function __construct()
    {
        $mode = config('paypal.mode', 'sandbox');
        $this->baseUrl      = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
        $this->clientId     = $mode === 'live'
            ? config('paypal.live.client_id')
            : config('paypal.sandbox.client_id');
        $this->clientSecret = $mode === 'live'
            ? config('paypal.live.client_secret')
            : config('paypal.sandbox.client_secret');
    }

    private function getAccessToken(): string
    {
        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->asForm()
            ->post("{$this->baseUrl}/v1/oauth2/token", ['grant_type' => 'client_credentials']);

        if ($response->failed()) {
            abort(500, 'No se pudo conectar con PayPal.');
        }

        return $response->json('access_token');
    }

    private function authorizeOwner(Restaurant $restaurant): void
    {
        $user = Auth::user();

        if ($restaurant->owner_id !== $user->id) {
            abort(403, 'Solo el dueño del restaurante puede contratar un plan de patrocinio.');
        }
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'restaurant_id'    => 'required|integer|exists:restaurants,id',
            'visibility_level' => 'required|string|in:basic,featured,premium',
        ]);

        $restaurant = Restaurant::findOrFail($request->restaurant_id);
        $this->authorizeOwner($restaurant);

        $level  = $request->visibility_level;
        $amount = self::TIER_PRICES[$level];
        $label  = self::TIER_LABELS[$level];

        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post("{$this->baseUrl}/v2/checkout/orders", [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'reference_id' => "restaurant_{$restaurant->id}",
                    'description'  => "Turizteca · Plan {$label} · {$restaurant->name}",
                    'amount' => [
                        'currency_code' => config('paypal.currency', 'USD'),
                        'value'         => $amount,
                    ],
                ]],
                'application_context' => [
                    'brand_name' => 'Turizteca',
                    'user_action' => 'PAY_NOW',
                ],
            ]);

        if ($response->failed()) {
            return response()->json(['error' => 'Error al crear la orden de PayPal.'], 500);
        }

        return response()->json([
            'order_id' => $response->json('id'),
            'amount'   => $amount,
            'label'    => $label,
        ]);
    }

    public function captureOrder(Request $request)
    {
        $request->validate([
            'order_id'         => 'required|string',
            'restaurant_id'    => 'required|integer|exists:restaurants,id',
            'visibility_level' => 'required|string|in:basic,featured,premium',
        ]);

        $restaurant = Restaurant::findOrFail($request->restaurant_id);
        $this->authorizeOwner($restaurant);

        $level         = $request->visibility_level;
        $expectedPrice = self::TIER_PRICES[$level];
        $label         = self::TIER_LABELS[$level];
        $currency      = config('paypal.currency', 'USD');

        $token    = $this->getAccessToken();
        $response = Http::withToken($token)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->send('POST', "{$this->baseUrl}/v2/checkout/orders/{$request->order_id}/capture", ['body' => '{}']);

        \Log::info('PayPal capture response', [
            'status_code' => $response->status(),
            'body'        => $response->json(),
            'expected'    => ['price' => $expectedPrice, 'currency' => $currency, 'level' => $level],
        ]);

        if ($response->failed() || $response->json('status') !== 'COMPLETED') {
            return response()->json([
                'error' => 'El pago no pudo ser verificado con PayPal.',
                'debug' => ['status' => $response->json('status'), 'http' => $response->status()],
            ], 422);
        }

        // Verify the captured amount and currency match the expected tier price
        $capturedUnit  = $response->json('purchase_units.0.payments.captures.0');
        $capturedValue = $capturedUnit['amount']['value'] ?? null;
        $capturedCurrency = $capturedUnit['amount']['currency_code'] ?? null;

        if ($capturedValue !== $expectedPrice || $capturedCurrency !== $currency) {
            return response()->json([
                'error'    => 'El monto capturado no corresponde al plan seleccionado.',
                'debug'    => [
                    'expected_price'    => $expectedPrice,
                    'captured_value'    => $capturedValue,
                    'expected_currency' => $currency,
                    'captured_currency' => $capturedCurrency,
                ],
            ], 422);
        }

        // Prevent the same PayPal order from activating sponsorship on more than one restaurant
        $existing = Sponsorship::where('paypal_order_id', $request->order_id)->first();
        if ($existing && $existing->restaurant_id !== $restaurant->id) {
            return response()->json(['error' => 'Esta orden de PayPal ya fue utilizada.'], 409);
        }

        $sponsorship = Sponsorship::updateOrCreate(
            ['restaurant_id' => $restaurant->id],
            [
                'visibility_level' => $level,
                'label'            => $label,
                'paypal_order_id'  => $request->order_id,
            ]
        );

        $user = Auth::user();
        Mail::to($user->email)->queue(
            new SponsorshipConfirmationEmail($user, $sponsorship->load('restaurant'))
        );

        return response()->json([
            'data'   => $sponsorship->load('restaurant'),
            'status' => 'success',
        ], 201);
    }
}
