<!doctype html>
<html lang="es" class="h-full dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>@yield('title', 'Turizteca — Panel')</title>
  <meta name="description" content="Panel administrador de Turizteca" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = { darkMode: 'class', theme: { extend: { colors: { brand: { 50:'#eef6ff',100:'#d9ebff',200:'#b7d9ff',300:'#8fc2ff',400:'#63a7ff',500:'#3b8aff',600:'#2563eb',700:'#1d4ed8',800:'#153f8c',900:'#122b61' } } } } };
  </script>
  <link rel="stylesheet" href="{{ asset('turizteca/css/turizteca-admin.css') }}">
  @stack('styles')
</head>
<body class="h-full text-slate-100">
  <div class="h-screen w-full flex overflow-hidden">
    @include('front.sidebar')
    <div class="flex-1 flex flex-col min-w-0">
      @include('front.navbar')
      <main class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">@yield('content')</main>
      @include('front.footer')
    </div>
  </div>
  <script>
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    function isDesktop(){ return window.matchMedia('(min-width: 1024px)').matches; }
    function openSidebarMobile(){ sidebar.classList.remove('hidden'); sidebar.classList.add('fixed','inset-y-0','z-40','shadow-2xl'); sidebarBackdrop.style.display='block'; }
    function closeSidebarMobile(){ sidebar.classList.add('hidden'); sidebar.classList.remove('fixed','inset-y-0','z-40','shadow-2xl'); sidebarBackdrop.style.display='none'; }
    function toggleSidebar(){ if (isDesktop()){ sidebar.classList.toggle('hidden-lg'); } else { if (sidebar.classList.contains('hidden')) openSidebarMobile(); else closeSidebarMobile(); } }
    if (toggleSidebarBtn){ toggleSidebarBtn.addEventListener('click', toggleSidebar); }
    if (sidebarBackdrop){ sidebarBackdrop.addEventListener('click', closeSidebarMobile); }
    window.addEventListener('resize', () => { closeSidebarMobile(); sidebar.classList.remove('hidden-lg'); });
  </script>
  @stack('scripts')
</body>
</html>
