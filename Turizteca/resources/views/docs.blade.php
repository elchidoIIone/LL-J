<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Turizteca API | Documentación Oficial</title>
    
    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <!-- Prism.js for Syntax Highlighting (Dark Theme) -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />

    <style>
        :root {
            --primary-color: #6366f1;
            --primary-hover: #4f46e5;
            --sidebar-bg: #ffffff;
            --content-bg: #f8fafc;
            --text-main: #1e293b;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --code-bg: #1e293b;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--content-bg);
            color: var(--text-main);
            overflow-x: hidden;
        }

        /* Lateral Sidebar */
        .sidebar {
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 100;
            width: 280px;
            padding: 0;
            background-color: var(--sidebar-bg);
            border-right: 1px solid var(--border-color);
            transition: all 0.3s ease;
            overflow-y: auto;
        }

        .sidebar-header {
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }

        .brand-logo {
            font-weight: 700;
            font-size: 1.25rem;
            color: var(--primary-color);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
        }

        .nav-links {
            padding: 1.5rem 0;
        }

        .nav-link {
            padding: 0.75rem 1.5rem;
            color: var(--text-muted);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: all 0.2s;
            border-left: 3px solid transparent;
        }

        .nav-link:hover {
            color: var(--primary-color);
            background-color: #f1f5f9;
        }

        .nav-link.active {
            color: var(--primary-color);
            background-color: #eef2ff;
            border-left-color: var(--primary-color);
        }

        /* Main Content */
        main {
            margin-left: 280px;
            padding: 2rem 3rem;
            min-height: 100vh;
        }

        .doc-section {
            padding-top: 4rem;
            margin-top: -2rem;
            margin-bottom: 4rem;
        }

        .section-title {
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        /* Badges */
        .badge-method {
            padding: 0.4rem 0.8rem;
            font-weight: 700;
            font-size: 0.75rem;
            border-radius: 6px;
            text-transform: uppercase;
            min-width: 70px;
            text-align: center;
        }

        .badge-get { background-color: #dcfce7; color: #166534; }
        .badge-post { background-color: #dbeafe; color: #1e40af; }
        .badge-put { background-color: #fef9c3; color: #854d0e; }
        .badge-delete { background-color: #fee2e2; color: #991b1b; }

        /* API Cards */
        .api-card {
            background: #fff;
            border-radius: 12px;
            border: 1px solid var(--border-color);
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
        }

        .api-header {
            padding: 1.25rem 1.5rem;
            background-color: #fff;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .api-endpoint {
            font-family: 'JetBrains Mono', 'Courier New', monospace;
            font-weight: 600;
            color: var(--text-main);
            font-size: 0.95rem;
        }

        .api-body {
            padding: 1.5rem;
        }

        .code-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #2d2d2d;
            padding: 0.5rem 1rem;
            border-radius: 8px 8px 0 0;
            color: #ccc;
            font-size: 0.8rem;
            font-weight: 500;
        }

        pre[class*="language-"] {
            margin-top: 0 !important;
            border-radius: 0 0 8px 8px !important;
            font-size: 0.85rem !important;
        }

        /* Glassmorphism utility */
        .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        /* Responsive */
        @media (max-width: 992px) {
            .sidebar {
                width: 70px;
                overflow: hidden;
            }
            .sidebar:hover {
                width: 280px;
                overflow-y: auto;
            }
            main {
                margin-left: 70px;
                padding: 2rem 1.5rem;
            }
            .nav-link span {
                display: none;
            }
            .sidebar:hover .nav-link span {
                display: inline;
            }
            .sidebar-header .brand-text {
                display: none;
            }
            .sidebar:hover .sidebar-header .brand-text {
                display: inline;
            }
        }
    </style>
</head>
<body>

    <!-- Sidebar -->
    <nav class="sidebar">
        <div class="sidebar-header">
            <a href="#intro" class="brand-logo">
                <img src="/turizteca/img/Turizteca-Logo.png" alt="Turizteca Logo" style="height:36px; width:auto; object-fit:contain;" loading="lazy" decoding="async"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
                <span class="brand-text" style="display:flex; align-items:center; gap:0.4rem;">
                    <i class="bi bi-geo-alt-fill"></i> Turizteca
                </span>
            </a>
        </div>
        <div class="nav-links">
            <a href="#intro" class="nav-link active">
                <i class="bi bi-house-door"></i>
                <span>Introducción</span>
            </a>

            <!-- Auth -->
            <div class="px-4 py-2 small text-uppercase text-muted fw-bold" style="font-size: 0.65rem; letter-spacing: 0.05rem;">
                Auth (AuthController)
            </div>
            <a href="#post-register" class="nav-link">
                <i class="bi bi-person-plus"></i>
                <span>Registrar Usuario</span>
            </a>
            <a href="#post-login" class="nav-link">
                <i class="bi bi-shield-lock"></i>
                <span>Login</span>
            </a>
            <a href="#post-logout" class="nav-link">
                <i class="bi bi-box-arrow-right"></i>
                <span>Logout</span>
            </a>
            <a href="#get-auth-user" class="nav-link">
                <i class="bi bi-person-badge"></i>
                <span>Ver Perfil (Auth)</span>
            </a>
            <a href="#put-auth-user" class="nav-link">
                <i class="bi bi-pencil-square"></i>
                <span>Actualizar Perfil (Auth)</span>
            </a>

            <!-- Users -->
            <div class="px-4 py-2 mt-2 small text-uppercase text-muted fw-bold" style="font-size: 0.65rem; letter-spacing: 0.05rem;">
                Usuarios (UsersAPIController)
            </div>
            <a href="#get-users" class="nav-link">
                <i class="bi bi-people"></i>
                <span>Listar Usuarios</span>
            </a>
            <a href="#post-user" class="nav-link">
                <i class="bi bi-person-add"></i>
                <span>Crear Usuario</span>
            </a>
            <a href="#get-user-id" class="nav-link">
                <i class="bi bi-person-lines-fill"></i>
                <span>Ver Usuario</span>
            </a>
            <a href="#put-user-id" class="nav-link">
                <i class="bi bi-person-gear"></i>
                <span>Actualizar Usuario</span>
            </a>
            <a href="#delete-user-id" class="nav-link">
                <i class="bi bi-person-x"></i>
                <span>Eliminar Usuario</span>
            </a>

            <!-- Restaurants -->
            <div class="px-4 py-2 mt-2 small text-uppercase text-muted fw-bold" style="font-size: 0.65rem; letter-spacing: 0.05rem;">
                Restaurantes (RRestaurantsAPIController)
            </div>
            <a href="#get-restaurants" class="nav-link">
                <i class="bi bi-shop"></i>
                <span>Listar Restaurantes</span>
            </a>
            <a href="#post-restaurant" class="nav-link">
                <i class="bi bi-shop-window"></i>
                <span>Crear Restaurante</span>
            </a>
            <a href="#get-restaurant-id" class="nav-link">
                <i class="bi bi-building"></i>
                <span>Ver Restaurante</span>
            </a>
            <a href="#put-restaurant-id" class="nav-link">
                <i class="bi bi-pencil"></i>
                <span>Actualizar Restaurante</span>
            </a>
            <a href="#delete-restaurant-id" class="nav-link">
                <i class="bi bi-trash"></i>
                <span>Eliminar Restaurante</span>
            </a>

            <!-- Reviews -->
            <div class="px-4 py-2 mt-2 small text-uppercase text-muted fw-bold" style="font-size: 0.65rem; letter-spacing: 0.05rem;">
                Reseñas (ReviewsAPIController)
            </div>
            <a href="#get-reviews" class="nav-link">
                <i class="bi bi-star-half"></i>
                <span>Listar Reseñas</span>
            </a>
            <a href="#post-review" class="nav-link">
                <i class="bi bi-star"></i>
                <span>Crear Reseña</span>
            </a>
            <a href="#get-review-id" class="nav-link">
                <i class="bi bi-chat-left-text"></i>
                <span>Ver Reseña</span>
            </a>
            <a href="#put-review-id" class="nav-link">
                <i class="bi bi-chat-left-dots"></i>
                <span>Actualizar Reseña</span>
            </a>
            <a href="#delete-review-id" class="nav-link">
                <i class="bi bi-chat-left-x"></i>
                <span>Eliminar Reseña</span>
            </a>

            <!-- Sponsorships -->
            <div class="px-4 py-2 mt-2 small text-uppercase text-muted fw-bold" style="font-size: 0.65rem; letter-spacing: 0.05rem;">
                Patrocinios (SponsorshipsAPIController)
            </div>
            <a href="#get-sponsorships" class="nav-link">
                <i class="bi bi-award"></i>
                <span>Listar Patrocinios</span>
            </a>
            <a href="#post-sponsorship" class="nav-link">
                <i class="bi bi-award-fill"></i>
                <span>Crear Patrocinio</span>
            </a>
            <a href="#get-sponsorship-id" class="nav-link">
                <i class="bi bi-trophy"></i>
                <span>Ver Patrocinio</span>
            </a>
            <a href="#put-sponsorship-id" class="nav-link">
                <i class="bi bi-trophy-fill"></i>
                <span>Actualizar Patrocinio</span>
            </a>
            <a href="#delete-sponsorship-id" class="nav-link">
                <i class="bi bi-x-circle"></i>
                <span>Eliminar Patrocinio</span>
            </a>

            <!-- UserCuisines -->
            <div class="px-4 py-2 mt-2 small text-uppercase text-muted fw-bold" style="font-size: 0.65rem; letter-spacing: 0.05rem;">
                Cocinas de Usuario (UserCuisinesAPIController)
            </div>
            <a href="#get-user-cuisines" class="nav-link">
                <i class="bi bi-egg-fried"></i>
                <span>Listar Cocinas</span>
            </a>
            <a href="#post-user-cuisine" class="nav-link">
                <i class="bi bi-plus-circle"></i>
                <span>Asignar Cocina</span>
            </a>
            <a href="#get-user-cuisine-id" class="nav-link">
                <i class="bi bi-search"></i>
                <span>Ver Cocina</span>
            </a>
            <a href="#put-user-cuisine-id" class="nav-link">
                <i class="bi bi-arrow-repeat"></i>
                <span>Actualizar Cocina</span>
            </a>
            <a href="#delete-user-cuisine-id" class="nav-link">
                <i class="bi bi-dash-circle"></i>
                <span>Eliminar Cocina</span>
            </a>

            <!-- Errors -->
            <div class="px-4 py-2 mt-2 small text-uppercase text-muted fw-bold" style="font-size: 0.65rem; letter-spacing: 0.05rem;">
                Referencia
            </div>
            <a href="#errors" class="nav-link">
                <i class="bi bi-exclamation-triangle"></i>
                <span>Formatos de Error</span>
            </a>
        </div>
    </nav>

    <!-- Main Content -->
    <main>
        <div class="container-fluid">

            <!-- Intro -->
            <section id="intro" class="doc-section">
                <div class="row">
                    <div class="col-lg-8">
                        <h1 class="display-6 fw-bold mb-4">Documentación de la API</h1>
                        <p class="lead text-muted">
                            Bienvenido a la documentación técnica de <strong>Turizteca</strong>. Nuestra API está diseñada bajo los estándares RESTful, utilizando <strong>JWT</strong> para la autenticación y <strong>JSON</strong> para el intercambio de datos.
                        </p>
                        <div class="alert alert-info border-0 shadow-sm glass">
                            <i class="bi bi-info-circle-fill me-2"></i>
                            Todas las peticiones deben incluir el header <code>Accept: application/json</code>. Los endpoints protegidos requieren <code>Authorization: Bearer {token}</code>.
                        </div>
                        <div class="alert alert-warning border-0 shadow-sm glass mt-3">
                            <i class="bi bi-shield-lock-fill me-2"></i>
                            Los endpoints marcados con <i class="bi bi-lock-fill"></i> <strong>requieren autenticación JWT</strong> en el header <code>Authorization: Bearer {token}</code>.
                        </div>
                    </div>
                </div>
            </section>

            <hr class="my-5 border-secondary-subtle">

            <!-- ===================== AUTH CONTROLLER ===================== -->
            <section id="auth-section" class="doc-section">
                <h2 class="section-title fs-4 text-uppercase text-muted" style="letter-spacing:0.05rem;">
                    <i class="bi bi-shield-shaded text-primary"></i> AuthController
                </h2>

                <!-- POST /api/register -->
                <section id="post-register" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-person-plus-fill text-primary"></i>Registrar Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/register</span>
                        </div>
                        <div class="api-body">
                            <p>Crea una nueva cuenta de usuario y retorna un token JWT.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "name": "Juan Pérez",
    "email": "juan@turizteca.com",
    "password": "secret123",
    "password_confirmation": "secret123"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (201 Created)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@turizteca.com",
        "created_at": "2026-04-20T10:00:00.000000Z"
    }
}</code></pre>
                                </div>
                            </div>
                            <h6 class="fw-bold mt-4 mb-2">Validaciones</h6>
                            <table class="table table-sm table-bordered">
                                <thead class="table-light"><tr><th>Campo</th><th>Reglas</th></tr></thead>
                                <tbody>
                                    <tr><td><code>name</code></td><td>requerido, string, máx. 255</td></tr>
                                    <tr><td><code>email</code></td><td>requerido, email, único en users</td></tr>
                                    <tr><td><code>password</code></td><td>requerido, mín. 6 caracteres, confirmado</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- POST /api/login -->
                <section id="post-login" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-shield-lock-fill text-primary"></i>Login</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/login</span>
                        </div>
                        <div class="api-body">
                            <p>Inicia sesión en el sistema y obtiene un token de acceso JWT.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "email": "juan@turizteca.com",
    "password": "secret123"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "user": {
        "id": 1,
        "name": "Juan Pérez",
        "email": "juan@turizteca.com"
    },
    "expires_in": 3600
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- POST /api/logout -->
                <section id="post-logout" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-box-arrow-right text-danger"></i>Logout</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/logout</span>
                            <span class="ms-auto small text-muted"><i class="bi bi-lock-fill"></i> Requiere Bearer Token</span>
                        </div>
                        <div class="api-body">
                            <p>Invalida el token JWT activo del usuario autenticado.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "Successfully logged out"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- GET /api/user (auth) -->
                <section id="get-auth-user" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-person-badge-fill text-success"></i>Ver Perfil (Autenticado)</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/user</span>
                            <span class="ms-auto small text-muted"><i class="bi bi-lock-fill"></i> Requiere Bearer Token</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna el perfil del usuario actualmente autenticado a través del token JWT.</p>
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "id": 6,
    "name": "Juan Pérez",
    "email": "juan@turizteca.com",
    "account_type": "customer",
    "preferred_budget": "medium",
    "created_at": "2026-04-20T10:00:00.000000Z",
    "updated_at": "2026-04-20T10:00:00.000000Z"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- PUT /api/user hola (auth) -->
                <section id="put-auth-user" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-pencil-square text-warning"></i>Actualizar Perfil (Autenticado)</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-put">PUT</span>
                            <span class="api-endpoint">/api/user</span>
                            <span class="ms-auto small text-muted"><i class="bi bi-lock-fill"></i> Requiere Bearer Token</span>
                        </div>
                        <div class="api-body">
                            <p>Actualiza el nombre y/o email del usuario autenticado.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "name": "Nuevo Nombre",
    "email": "nuevo@email.com"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "id": 1,
    "name": "Nuevo Nombre",
    "email": "nuevo@email.com",
    "updated_at": "2026-04-20T11:00:00.000000Z"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <hr class="my-5 border-secondary-subtle">

            <!-- ===================== USERS API CONTROLLER ===================== -->
            <section id="users-section" class="doc-section">
                <h2 class="section-title fs-4 text-uppercase text-muted" style="letter-spacing:0.05rem;">
                    <i class="bi bi-people-fill text-primary"></i> UsersAPIController
                </h2>

                <!-- GET /api/users -->
                <section id="get-users" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-people-fill text-success"></i>Listar Usuarios</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/users</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna todos los usuarios ordenados por ID descendente.</p>
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": [
        {
            "id": 5,
            "name": "María López",
            "email": "maria@turizteca.com",
            "account_type": "owner",
            "preferred_budget": "high",
            "created_at": "2026-04-20T10:00:00.000000Z"
        }
    ],
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- POST /api/users -->
                <section id="post-user" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-person-add text-primary"></i>Crear Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/users</span>
                        </div>
                        <div class="api-body">
                            <p>Crea un nuevo usuario en el sistema.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "name": "Carlos Ruiz",
    "email": "carlos@turizteca.com",
    "password": "pass1234",
    "account_type": "customer",
    "preferred_budget": "low"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (201 Created)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 6,
        "name": "Carlos Ruiz",
        "email": "carlos@turizteca.com",
        "account_type": "customer",
        "preferred_budget": "low"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                            <h6 class="fw-bold mt-4 mb-2">Validaciones</h6>
                            <table class="table table-sm table-bordered">
                                <thead class="table-light"><tr><th>Campo</th><th>Reglas</th></tr></thead>
                                <tbody>
                                    <tr><td><code>name</code></td><td>requerido, string, mín. 3, máx. 120</td></tr>
                                    <tr><td><code>email</code></td><td>requerido, email, único en users</td></tr>
                                    <tr><td><code>password</code></td><td>requerido, mín. 4</td></tr>
                                    <tr><td><code>account_type</code></td><td>requerido, enum: <code>customer</code> | <code>owner</code> | <code>admin</code></td></tr>
                                    <tr><td><code>preferred_budget</code></td><td>opcional, enum: <code>low</code> | <code>medium</code> | <code>high</code></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- GET /api/users/{id} -->
                <section id="get-user-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-person-lines-fill text-success"></i>Ver Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/users/{id}</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna los datos de un usuario específico por su ID.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 6,
        "name": "Carlos Ruiz",
        "email": "carlos@turizteca.com",
        "account_type": "customer",
        "preferred_budget": "low",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "User not found",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- PUT /api/users/{id} -->
                <section id="put-user-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-person-gear text-warning"></i>Actualizar Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-put">PUT</span>
                            <span class="api-endpoint">/api/users/{id}</span>
                        </div>
                        <div class="api-body">
                            <p>Actualiza parcialmente los datos de un usuario. Todos los campos son opcionales (<code>sometimes</code>).</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "name": "Carlos Actualizado",
    "preferred_budget": "high"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 6,
        "name": "Carlos Actualizado",
        "email": "carlos@turizteca.com",
        "account_type": "customer",
        "preferred_budget": "high",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T12:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- DELETE /api/users/{id} -->
                <section id="delete-user-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-person-x-fill text-danger"></i>Eliminar Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-delete">DELETE</span>
                            <span class="api-endpoint">/api/users/{id}</span>
                        </div>
                        <div class="api-body">
                            <p class="text-danger fw-bold">Esta acción es irreversible.</p>
                            <p>Elimina permanentemente un usuario del sistema.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (204 No Content)</h6>
                                    <div class="border p-3 bg-light rounded text-center text-muted">
                                        <em>La respuesta no contiene cuerpo de mensaje.</em>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "User not found",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <hr class="my-5 border-secondary-subtle">

            <!-- ===================== RESTAURANTS API CONTROLLER ===================== -->
            <section id="restaurants-section" class="doc-section">
                <h2 class="section-title fs-4 text-uppercase text-muted" style="letter-spacing:0.05rem;">
                    <i class="bi bi-shop-fill text-primary"></i> RRestaurantsAPIController
                </h2>

                <!-- GET /api/restaurants -->
                <section id="get-restaurants" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-shop text-success"></i>Listar Restaurantes</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/restaurants</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna todos los restaurantes con su relación <code>owner</code> incluida.</p>
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": [
        {
            "id": 1,
            "owner_id": 2,
            "name": "El Rincón Mexicano",
            "description": "Comida típica del norte de México",
            "cuisine_type": "mexican",
            "average_price": 150.00,
            "location_lat": 29.7,
            "location_lng": -107.9,
            "opening_hours_type": "fixed",
            "opens_at": "08:00",
            "closes_at": "22:00",
            "created_at": "2026-04-20T10:00:00.000000Z",
            "updated_at": "2026-04-20T10:00:00.000000Z",
            "owner": {
                "id": 2,
                "name": "María López",
                "email": "maria@turizteca.com",
                "account_type": "owner",
                "preferred_budget": "high"
            }
        }
    ],
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- POST /api/restaurants -->
                <section id="post-restaurant" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-shop-window text-primary"></i>Crear Restaurante</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/restaurants</span>
                        </div>
                        <div class="api-body">
                            <p>Registra un nuevo restaurante en el sistema.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "owner_id": 2,
    "name": "El Rincón Mexicano",
    "description": "Comida típica del norte",
    "cuisine_type": "mexican",
    "average_price": 150.00,
    "location_lat": 29.7,
    "location_lng": -107.9,
    "opening_hours_type": "fixed",
    "opens_at": "08:00",
    "closes_at": "22:00"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (201 Created)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 1,
        "owner_id": 2,
        "name": "El Rincón Mexicano",
        "description": "Comida típica del norte",
        "cuisine_type": "mexican",
        "average_price": 150.00,
        "location_lat": 29.7,
        "location_lng": -107.9,
        "opening_hours_type": "fixed",
        "opens_at": "08:00",
        "closes_at": "22:00",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                            <h6 class="fw-bold mt-4 mb-2">Validaciones</h6>
                            <table class="table table-sm table-bordered">
                                <thead class="table-light"><tr><th>Campo</th><th>Reglas</th></tr></thead>
                                <tbody>
                                    <tr><td><code>owner_id</code></td><td>requerido, numérico</td></tr>
                                    <tr><td><code>name</code></td><td>requerido, string</td></tr>
                                    <tr><td><code>description</code></td><td>opcional, string</td></tr>
                                    <tr><td><code>cuisine_type</code></td><td>opcional, string</td></tr>
                                    <tr><td><code>average_price</code></td><td>opcional, numérico</td></tr>
                                    <tr><td><code>location_lat</code></td><td>opcional, numérico</td></tr>
                                    <tr><td><code>location_lng</code></td><td>opcional, numérico</td></tr>
                                    <tr><td><code>opening_hours_type</code></td><td>opcional, string</td></tr>
                                    <tr><td><code>opens_at</code></td><td>opcional, string (HH:MM)</td></tr>
                                    <tr><td><code>closes_at</code></td><td>opcional, string (HH:MM)</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- GET /api/restaurants/{id} -->
                <section id="get-restaurant-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-building text-success"></i>Ver Restaurante</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/restaurants/{id}</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna los detalles de un restaurante incluyendo su <code>owner</code>.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 1,
        "owner_id": 2,
        "name": "El Rincón Mexicano",
        "description": "Comida típica del norte de México",
        "cuisine_type": "mexican",
        "average_price": 150.00,
        "location_lat": 29.7,
        "location_lng": -107.9,
        "opening_hours_type": "fixed",
        "opens_at": "08:00",
        "closes_at": "22:00",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z",
        "owner": {
            "id": 2,
            "name": "María López",
            "email": "maria@turizteca.com",
            "account_type": "owner",
            "preferred_budget": "high"
        }
    },
    "status": "success"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "Restaurante no encontrado",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- PUT /api/restaurants/{id} -->
                <section id="put-restaurant-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-pencil text-warning"></i>Actualizar Restaurante</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-put">PUT</span>
                            <span class="api-endpoint">/api/restaurants/{id}</span>
                        </div>
                        <div class="api-body">
                            <p>Actualiza los datos de un restaurante existente.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "name": "Nuevo Nombre",
    "average_price": 200.00
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 1,
        "owner_id": 2,
        "name": "Nuevo Nombre",
        "description": "Comida típica del norte de México",
        "cuisine_type": "mexican",
        "average_price": 200.00,
        "location_lat": 29.7,
        "location_lng": -107.9,
        "opening_hours_type": "fixed",
        "opens_at": "08:00",
        "closes_at": "22:00",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T12:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- DELETE /api/restaurants/{id} -->
                <section id="delete-restaurant-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-trash-fill text-danger"></i>Eliminar Restaurante</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-delete">DELETE</span>
                            <span class="api-endpoint">/api/restaurants/{id}</span>
                        </div>
                        <div class="api-body">
                            <p class="text-danger fw-bold">Esta acción es irreversible.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (204 No Content)</h6>
                                    <div class="border p-3 bg-light rounded text-center text-muted"><em>Sin cuerpo de respuesta.</em></div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "Restaurante no encontrado",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <hr class="my-5 border-secondary-subtle">

            <!-- ===================== REVIEWS API CONTROLLER ===================== -->
            <section id="reviews-section" class="doc-section">
                <h2 class="section-title fs-4 text-uppercase text-muted" style="letter-spacing:0.05rem;">
                    <i class="bi bi-star-fill text-warning"></i> ReviewsAPIController
                </h2>

                <!-- GET /api/reviews -->
                <section id="get-reviews" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-star-half text-success"></i>Listar Reseñas</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/reviews</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna todas las reseñas con sus relaciones <code>restaurant</code> y <code>user</code>.</p>
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": [
        {
            "id": 1,
            "restaurant_id": 1,
            "user_id": 6,
            "rating": 5,
            "comment": "Excelente servicio y sabor!",
            "created_at": "2026-04-20T10:00:00.000000Z",
            "updated_at": "2026-04-20T10:00:00.000000Z",
            "restaurant": {
                "id": 1,
                "name": "El Rincón Mexicano",
                "cuisine_type": "mexican"
            },
            "user": {
                "id": 6,
                "name": "Carlos Ruiz",
                "email": "carlos@turizteca.com",
                "account_type": "customer"
            }
        }
    ],
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- POST /api/reviews -->
                <section id="post-review" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-star-fill text-primary"></i>Crear Reseña</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/reviews</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "restaurant_id": 1,
    "user_id": 6,
    "rating": 4,
    "comment": "Muy buena comida."
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (201 Created)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 2,
        "restaurant_id": 1,
        "user_id": 6,
        "rating": 4,
        "comment": "Muy buena comida.",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                            <h6 class="fw-bold mt-4 mb-2">Validaciones</h6>
                            <table class="table table-sm table-bordered">
                                <thead class="table-light"><tr><th>Campo</th><th>Reglas</th></tr></thead>
                                <tbody>
                                    <tr><td><code>restaurant_id</code></td><td>requerido, numérico</td></tr>
                                    <tr><td><code>user_id</code></td><td>requerido, numérico</td></tr>
                                    <tr><td><code>rating</code></td><td>requerido, entero, mín. 1, máx. 5</td></tr>
                                    <tr><td><code>comment</code></td><td>opcional, string</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- GET /api/reviews/{id} -->
                <section id="get-review-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-chat-left-text text-success"></i>Ver Reseña</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/reviews/{id}</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna una reseña específica con sus relaciones.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 1,
        "restaurant_id": 1,
        "user_id": 6,
        "rating": 5,
        "comment": "Excelente!",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z",
        "restaurant": { "id": 1, "name": "El Rincón Mexicano", "cuisine_type": "mexican" },
        "user": { "id": 6, "name": "Carlos Ruiz", "account_type": "customer" }
    },
    "status": "success"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "Reseña no encontrada",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- PUT /api/reviews/{id} -->
                <section id="put-review-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-chat-left-dots text-warning"></i>Actualizar Reseña</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-put">PUT</span>
                            <span class="api-endpoint">/api/reviews/{id}</span>
                        </div>
                        <div class="api-body">
                            <p>Actualiza el rating y/o comentario de una reseña.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "rating": 3,
    "comment": "Servicio mejorable."
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 1,
        "restaurant_id": 1,
        "user_id": 6,
        "rating": 3,
        "comment": "Servicio mejorable.",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T12:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- DELETE /api/reviews/{id} -->
                <section id="delete-review-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-chat-left-x-fill text-danger"></i>Eliminar Reseña</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-delete">DELETE</span>
                            <span class="api-endpoint">/api/reviews/{id}</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (204 No Content)</h6>
                                    <div class="border p-3 bg-light rounded text-center text-muted"><em>Sin cuerpo de respuesta.</em></div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "Reseña no encontrada",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <hr class="my-5 border-secondary-subtle">

            <!-- ===================== SPONSORSHIPS API CONTROLLER ===================== -->
            <section id="sponsorships-section" class="doc-section">
                <h2 class="section-title fs-4 text-uppercase text-muted" style="letter-spacing:0.05rem;">
                    <i class="bi bi-award-fill text-warning"></i> SponsorshipsAPIController
                </h2>

                <!-- GET /api/sponsorships -->
                <section id="get-sponsorships" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-award text-success"></i>Listar Patrocinios</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/sponsorships</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna todos los patrocinios con su relación <code>restaurant</code>.</p>
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": [
        {
            "id": 1,
            "restaurant_id": 1,
            "visibility_level": "high",
            "label": "Patrocinado",
            "created_at": "2026-04-20T10:00:00.000000Z",
            "updated_at": "2026-04-20T10:00:00.000000Z",
            "restaurant": {
                "id": 1,
                "name": "El Rincón Mexicano",
                "cuisine_type": "mexican"
            }
        }
    ],
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- POST /api/sponsorships -->
                <section id="post-sponsorship" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-award-fill text-primary"></i>Crear Patrocinio</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/sponsorships</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "restaurant_id": 1,
    "visibility_level": "high",
    "label": "Destacado del mes"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (201 Created)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 2,
        "restaurant_id": 1,
        "visibility_level": "high",
        "label": "Destacado del mes",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                            <h6 class="fw-bold mt-4 mb-2">Validaciones</h6>
                            <table class="table table-sm table-bordered">
                                <thead class="table-light"><tr><th>Campo</th><th>Reglas</th></tr></thead>
                                <tbody>
                                    <tr><td><code>restaurant_id</code></td><td>requerido, numérico</td></tr>
                                    <tr><td><code>visibility_level</code></td><td>requerido, enum: <code>low</code> | <code>medium</code> | <code>high</code></td></tr>
                                    <tr><td><code>label</code></td><td>opcional, string</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                <!-- GET /api/sponsorships/{id} -->
                <section id="get-sponsorship-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-trophy text-success"></i>Ver Patrocinio</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/sponsorships/{id}</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 1,
        "restaurant_id": 1,
        "visibility_level": "high",
        "label": "Patrocinado",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z",
        "restaurant": {
            "id": 1,
            "name": "El Rincón Mexicano",
            "cuisine_type": "mexican"
        }
    },
    "status": "success"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "Patrocinio no encontrado",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- PUT /api/sponsorships/{id} -->
                <section id="put-sponsorship-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-trophy-fill text-warning"></i>Actualizar Patrocinio</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-put">PUT</span>
                            <span class="api-endpoint">/api/sponsorships/{id}</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "visibility_level": "medium",
    "label": "Nuevo Label"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 1,
        "restaurant_id": 1,
        "visibility_level": "medium",
        "label": "Nuevo Label",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T12:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- DELETE /api/sponsorships/{id} -->
                <section id="delete-sponsorship-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-x-circle-fill text-danger"></i>Eliminar Patrocinio</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-delete">DELETE</span>
                            <span class="api-endpoint">/api/sponsorships/{id}</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (204 No Content)</h6>
                                    <div class="border p-3 bg-light rounded text-center text-muted"><em>Sin cuerpo de respuesta.</em></div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "Patrocinio no encontrado",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <hr class="my-5 border-secondary-subtle">

            <!-- ===================== USER CUISINES API CONTROLLER ===================== -->
            <section id="user-cuisines-section" class="doc-section">
                <h2 class="section-title fs-4 text-uppercase text-muted" style="letter-spacing:0.05rem;">
                    <i class="bi bi-egg-fried text-primary"></i> UserCuisinesAPIController
                </h2>

                <!-- GET /api/user-cuisines -->
                <section id="get-user-cuisines" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-egg-fried text-success"></i>Listar Cocinas de Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/user-cuisines</span>
                        </div>
                        <div class="api-body">
                            <p>Retorna todas las preferencias de cocina de usuarios, ordenadas por ID descendente, con relación <code>user</code>.</p>
                            <div class="row mt-4">
                                <div class="col-md-12">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": [
        {
            "id": 3,
            "user_id": 6,
            "cuisine": "mexican",
            "created_at": "2026-04-20T10:00:00.000000Z",
            "updated_at": "2026-04-20T10:00:00.000000Z",
            "user": {
                "id": 6,
                "name": "Carlos Ruiz",
                "email": "carlos@turizteca.com",
                "account_type": "customer"
            }
        }
    ],
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- POST /api/user-cuisines -->
                <section id="post-user-cuisine" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-plus-circle-fill text-primary"></i>Asignar Cocina a Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-post">POST</span>
                            <span class="api-endpoint">/api/user-cuisines</span>
                        </div>
                        <div class="api-body">
                            <p>Asigna una preferencia de tipo de cocina a un usuario. No permite duplicados por usuario.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "user_id": 6,
    "cuisine": "italian"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (201 Created)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 4,
        "user_id": 6,
        "cuisine": "italian",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                            <h6 class="fw-bold mt-4 mb-2">Cocinas válidas (<code>cuisine</code>)</h6>
                            <p class="small text-muted">
                                <code>mexican</code>, <code>seafood</code>, <code>italian</code>, <code>bbq</code>, <code>steakhouse</code>, <code>vegan</code>, <code>vegetarian</code>, <code>asian</code>, <code>japanese</code>, <code>chinese</code>, <code>thai</code>, <code>indian</code>, <code>mediterranean</code>, <code>fast_food</code>, <code>cafe</code>, <code>bakery</code>, <code>tacos</code>, <code>pizza</code>, <code>burgers</code>, <code>bar</code>, <code>fusion</code>, <code>local</code>
                            </p>
                            <div class="alert alert-warning border-0 mt-2 small">
                                <i class="bi bi-exclamation-triangle-fill me-1"></i>
                                Retorna <strong>422</strong> si la cocina ya está asignada al usuario.
                            </div>
                        </div>
                    </div>
                </section>

                <!-- GET /api/user-cuisines/{id} -->
                <section id="get-user-cuisine-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-search text-success"></i>Ver Cocina de Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-get">GET</span>
                            <span class="api-endpoint">/api/user-cuisines/{id}</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 3,
        "user_id": 6,
        "cuisine": "mexican",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T10:00:00.000000Z",
        "user": {
            "id": 6,
            "name": "Carlos Ruiz",
            "account_type": "customer"
        }
    },
    "status": "success"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "User cuisine not found",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- PUT /api/user-cuisines/{id} -->
                <section id="put-user-cuisine-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-arrow-repeat text-warning"></i>Actualizar Cocina de Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-put">PUT</span>
                            <span class="api-endpoint">/api/user-cuisines/{id}</span>
                        </div>
                        <div class="api-body">
                            <p>Cambia el tipo de cocina asignada. No permite asignar una cocina ya existente para el mismo usuario.</p>
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Request Body</h6>
                                    <div class="code-block-header">JSON Payload</div>
                                    <pre><code class="language-json">{
    "cuisine": "japanese"
}</code></pre>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (200 OK)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "data": {
        "id": 3,
        "user_id": 6,
        "cuisine": "japanese",
        "created_at": "2026-04-20T10:00:00.000000Z",
        "updated_at": "2026-04-20T12:00:00.000000Z"
    },
    "status": "success"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- DELETE /api/user-cuisines/{id} -->
                <section id="delete-user-cuisine-id" class="doc-section">
                    <h2 class="section-title"><i class="bi bi-dash-circle-fill text-danger"></i>Eliminar Cocina de Usuario</h2>
                    <div class="api-card">
                        <div class="api-header">
                            <span class="badge-method badge-delete">DELETE</span>
                            <span class="api-endpoint">/api/user-cuisines/{id}</span>
                        </div>
                        <div class="api-body">
                            <div class="row mt-4">
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (204 No Content)</h6>
                                    <div class="border p-3 bg-light rounded text-center text-muted"><em>Sin cuerpo de respuesta.</em></div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="fw-bold mb-3">Response (404 Not Found)</h6>
                                    <div class="code-block-header">JSON Response</div>
                                    <pre><code class="language-json">{
    "message": "User cuisine not found",
    "status": "error"
}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>

            <hr class="my-5 border-secondary-subtle">

            <!-- Errors -->
            <section id="errors" class="doc-section">
                <h2 class="section-title"><i class="bi bi-exclamation-triangle-fill text-secondary"></i>Formatos de Error</h2>

                <div class="api-card mb-4">
                    <div class="api-header">
                        <span class="fw-bold">422 Unprocessable Entity — Validación fallida</span>
                    </div>
                    <div class="api-body">
                        
                        <div class="code-block-header">JSON Response</div>
                        <pre><code class="language-json">{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["El correo electrónico ya ha sido registrado."],
        "password": ["La contraseña debe tener al menos 6 caracteres."]
    }
}</code></pre>
                    </div>
                </div>

                <div class="api-card mb-4">
                    <div class="api-header">
                        <span class="fw-bold">401 Unauthorized — Credenciales inválidas</span>
                    </div>
                    <div class="api-body">
                        <div class="code-block-header">JSON Response</div>
                        <pre><code class="language-json">{
    "error": "Invalid credentials"
}</code></pre>
                    </div>
                </div>

                <div class="api-card mb-4">
                    <div class="api-header">
                        <span class="fw-bold">404 Not Found — Recurso no encontrado</span>
                    </div>
                    <div class="api-body">
                        <div class="code-block-header">JSON Response</div>
                        <pre><code class="language-json">{
    "message": "Recurso no encontrado",
    "status": "error"
}</code></pre>
                    </div>
                </div>

                <div class="api-card">
                    <div class="api-header">
                        <span class="fw-bold">500 Internal Server Error — Error de token JWT</span>
                    </div>
                    <div class="api-body">
                        <div class="code-block-header">JSON Response</div>
                        <pre><code class="language-json">{
    "error": "Could not create token"
}</code></pre>
                    </div>
                </div>
            </section>

            <footer class="mt-5 py-4 border-top text-center text-muted small">
                &copy; 2026 Turizteca API System. Todos los derechos reservados.
            </footer>

        </div>
    </main>

    <!-- Scripts -------->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.doc-section[id]');
            const navLinks = document.querySelectorAll('.nav-link');

            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    if (pageYOffset >= sectionTop - 100) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (current && link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            });
        });
    </script>
</body>
</html>