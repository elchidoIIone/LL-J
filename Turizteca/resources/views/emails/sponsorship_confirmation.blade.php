<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plan activado en Turizteca</title>
  <style>
    body { margin: 0; padding: 0; background: #FBF4E8; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1A0800 0%, #2A1200 100%); padding: 40px 32px 32px; text-align: center; }
    .header h1 { margin: 0; color: #FBF4E8; font-size: 28px; font-weight: 900; }
    .header p { margin: 8px 0 0; color: #C4A882; font-size: 14px; }
    .badge { display: inline-block; margin-top: 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FBF4E8; padding: 6px 18px; border-radius: 50px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .body { padding: 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #1A0800; margin-bottom: 12px; }
    .text { font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 16px; }
    .plan-card { background: #FBF4E8; border-radius: 12px; padding: 20px 24px; margin: 24px 0; border-left: 4px solid #C4501A; }
    .plan-card .plan-name { font-size: 20px; font-weight: 900; color: #C4501A; margin-bottom: 4px; }
    .plan-card .plan-detail { font-size: 13px; color: #888; }
    .plan-card .plan-restaurant { font-size: 15px; font-weight: 700; color: #1A0800; margin-top: 8px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #C4501A, #E8723C); color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 15px; }
    .footer { padding: 24px 32px; border-top: 1px solid #f0e8d8; text-align: center; font-size: 12px; color: #aaa; }
    .divider { height: 3px; background: linear-gradient(90deg, #C4501A, #D4960A, #1B7A6E); }
    .order-id { font-size: 11px; color: #bbb; font-family: monospace; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Turizteca</h1>
      <p>Confirmación de patrocinio</p>
      <div class="badge">Pago confirmado</div>
    </div>
    <div class="divider"></div>
    <div class="body">
      <div class="greeting">¡Hola, {{ $user->name }}!</div>
      <p class="text">
        Tu plan de patrocinio ha sido activado exitosamente. Tu restaurante ahora tendrá mayor visibilidad en Turizteca.
      </p>

      <div class="plan-card">
        <div class="plan-name">Plan {{ $sponsorship->label }}</div>
        @if($sponsorship->restaurant)
          <div class="plan-restaurant">{{ $sponsorship->restaurant->name }}</div>
        @endif
        <div class="plan-detail">Nivel: {{ ucfirst($sponsorship->visibility_level) }}</div>
        @if($sponsorship->paypal_order_id)
          <div class="order-id">Orden PayPal: {{ $sponsorship->paypal_order_id }}</div>
        @endif
      </div>

      <p class="text">
        Si tienes alguna duda o necesitas cancelar tu plan, contáctanos respondiendo este correo.
      </p>

      <p style="text-align:center; margin-bottom: 32px;">
        <a href="{{ config('app.url') }}" class="btn">Ver mi restaurante</a>
      </p>
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} Turizteca. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
