import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { getRestaurant, createSponsorship } from '../api';
import type { Restaurant, SponsorshipTier } from '../types';
import { SPONSORSHIP_TIERS } from '../types';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';

export default function Sponsorship() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedTier, setSelectedTier] = useState<SponsorshipTier>(SPONSORSHIP_TIERS[0]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!restaurantId) return;
    getRestaurant(Number(restaurantId))
      .then(res => setRestaurant(res.data?.data ?? res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const handlePaymentSuccess = async (_orderId: string) => {
    if (!restaurantId) return;
    try {
      await createSponsorship({
        restaurant_id: Number(restaurantId),
        visibility_level: selectedTier.level,
        label: selectedTier.label,
      });
      setSuccess(true);
    } catch {
      setError('El pago fue exitoso pero hubo un error al activar el plan. Contacta soporte.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 bg-secondary-container rounded-full flex items-center justify-center mb-6 shadow-lg">
          <span className="text-5xl">🎉</span>
        </div>
        <h2 className="font-headline text-3xl font-black text-on-surface mb-2">¡Activado!</h2>
        <p className="text-on-surface-variant max-w-xs mb-2">
          El plan <strong className="text-primary">{selectedTier.label}</strong> para{' '}
          <strong>{restaurant?.name}</strong> está activo.
        </p>
        <p className="text-sm text-on-surface-variant mb-8">Tu restaurante ahora tendrá mayor visibilidad en Turizteca.</p>
        <button
          onClick={() => navigate(`/restaurant/${restaurantId}`)}
          className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-bold shadow-lg"
        >
          Ver mi restaurante
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header showBack title="Promocionar" />

      <div className="pt-24 px-6 max-w-lg mx-auto">
        <div className="space-y-2 mb-8">
          <span className="font-label text-tertiary uppercase tracking-widest text-xs font-bold">Patrocinio</span>
          <h2 className="font-headline text-3xl font-black text-on-surface">
            Destaca tu restaurante
          </h2>
          {restaurant && (
            <p className="text-on-surface-variant">Elige un plan para <strong className="text-on-surface">{restaurant.name}</strong></p>
          )}
        </div>

        {/* Tier selection */}
        <div className="space-y-4 mb-8">
          {SPONSORSHIP_TIERS.map(tier => (
            <button
              key={tier.level}
              type="button"
              onClick={() => setSelectedTier(tier)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                selectedTier.level === tier.level
                  ? 'border-primary bg-surface-container-low shadow-md'
                  : 'border-outline-variant/20 bg-surface-container-lowest hover:border-outline-variant'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {selectedTier.level === tier.level && (
                    <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                  <span
                    className="font-headline text-lg font-bold"
                    style={{ color: tier.color }}
                  >
                    {tier.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-headline text-2xl font-black text-primary">${tier.price}</span>
                  <span className="text-xs text-on-surface-variant font-label">/mes</span>
                </div>
              </div>

              <p className="text-sm text-on-surface-variant mb-3">{tier.description}</p>

              <ul className="space-y-1.5">
                {tier.perks.map(perk => (
                  <li key={perk} className="flex items-center gap-2 text-sm text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* PayPal */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/10 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="font-label font-bold text-on-surface-variant text-sm">Total a pagar</span>
            <span className="font-headline text-2xl font-black text-primary">${selectedTier.price} USD</span>
          </div>

          {error && (
            <div className="bg-error-container/20 border border-error/20 rounded-xl p-3 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-sm">error</span>
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <PayPalScriptProvider
            options={{
              clientId: PAYPAL_CLIENT_ID,
              currency: 'USD',
            }}
          >
            <PayPalButtons
              style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
              createOrder={(_data, actions) =>
                actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [{
                    description: `Turizteca - Plan ${selectedTier.label} para ${restaurant?.name}`,
                    amount: {
                      currency_code: 'USD',
                      value: String(selectedTier.price),
                    },
                  }],
                })
              }
              onApprove={async (_data, actions) => {
                const order = await actions.order?.capture();
                if (order?.id) await handlePaymentSuccess(order.id);
              }}
              onError={() => setError('Error al procesar el pago. Intenta de nuevo.')}
            />
          </PayPalScriptProvider>

          <p className="text-center text-xs text-on-surface-variant mt-4 font-label">
            🔒 Pago seguro procesado por PayPal. Puedes cancelar en cualquier momento.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
