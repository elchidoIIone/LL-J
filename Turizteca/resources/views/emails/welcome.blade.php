<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Turizteca</title>
  <style>
    body { margin: 0; padding: 0; background: #FBF4E8; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1A0800 0%, #2A1200 100%); padding: 40px 32px 32px; text-align: center; }
    .header h1 { margin: 0; color: #FBF4E8; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; color: #C4A882; font-size: 14px; }
    .body { padding: 32px; }
    .greeting { font-size: 18px; font-weight: 700; color: #1A0800; margin-bottom: 12px; }
    .text { font-size: 15px; color: #555; line-height: 1.6; margin-bottom: 24px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #C4501A, #E8723C); color: #fff !important; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 15px; }
    .footer { padding: 24px 32px; border-top: 1px solid #f0e8d8; text-align: center; font-size: 12px; color: #aaa; }
    .divider { height: 3px; background: linear-gradient(90deg, #C4501A, #D4960A, #1B7A6E); }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Turizteca</h1>
      <p>Descubre los mejores restaurantes</p>
    </div>
    <div class="divider"></div>
    <div class="body">
      <div class="greeting">¡Hola, {{ $user->name }}!</div>
      <p class="text">
        Tu cuenta en <strong>Turizteca</strong> ha sido creada exitosamente.
        Ya puedes explorar restaurantes, dejar reseñas y descubrir los mejores lugares cerca de ti.
      </p>
      <p class="text">
        Si eres dueño de un restaurante, también puedes registrar tu negocio y llegar a más clientes con nuestros planes de patrocinio.
      </p>
      <p style="text-align:center; margin-bottom: 32px;">
        <a href="{{ config('app.url') }}" class="btn">Explorar Turizteca</a>
      </p>
      <p class="text" style="font-size:13px; color:#aaa;">
        Si no creaste esta cuenta, puedes ignorar este correo.
      </p>
    </div>
    <div class="footer">
      &copy; {{ date('Y') }} Turizteca. Todos los derechos reservados.
    </div>
  </div>
</body>
</html>
