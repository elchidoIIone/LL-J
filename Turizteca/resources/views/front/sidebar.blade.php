<!-- Mobile backdrop for sidebar -->
<div id="sidebarBackdrop" class="sidebar-backdrop"></div>
<aside id="sidebar" class="sidebar hidden lg:flex lg:flex-col w-60 shrink-0">
  <div class="px-5 py-4 flex items-center gap-3 border-b border-slate-800">
  <div
    class="inline-flex h-12 w-12 items-center justify-center rounded-md bg-white p-1
           ring-1 ring-slate-200 shadow-sm overflow-hidden"
  >
    <img
      src="{{ asset('/turizteca/img/Turizteca-Logo.png') }}"
      alt="Turizteca Logo"
      class="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
    />
  </div>
  <div>
    <div class="text-base font-semibold">Turizteca</div>
    <div class="text-xs text-slate-400">Panel de Administración</div>
  </div>
</div>
  <nav class="p-3 overflow-y-auto">
    <div class="text-xs font-semibold text-slate-400 uppercase px-2 mb-2">Navegación</div>
    <ul class="space-y-1">
      <li><a href="{{ route('admin') }}" class="nav-link flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/70 cursor-pointer font-medium text-slate-200">Resumen</a></li>
      <li><a href="{{ route('admin.restaurants') }}" class="nav-link flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/70 cursor-pointer font-medium text-slate-200">Restaurantes</a></li>
      <li><a href="{{ route('admin.sponsorships') }}" class="nav-link flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/70 cursor-pointer font-medium text-slate-200">Patrocinios</a></li>
      <li><a href="{{ route('admin.reviews') }}" class="nav-link flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/70 cursor-pointer font-medium text-slate-200">Reseñas</a></li>
      <li><a href="{{ route('admin.users') }}" class="nav-link flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/70 cursor-pointer font-medium text-slate-200">Usuarios</a></li>
    </ul>
    <div class="text-xs font-semibold text-slate-400 uppercase px-2 mt-6 mb-2">Sistema</div>
    <ul class="space-y-1">
      <li><a href="{{ route('admin.settings') }}" class="nav-link flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/70 cursor-pointer font-medium text-slate-200">Configuración</a></li>
    </ul>
  </nav>
  <div class="mt-auto p-4 border-t border-slate-800">
    <div class="text-xs text-slate-400">Sesión iniciada como</div>
    <div class="text-sm font-medium">Administrador</div>
  </div>
</aside>
