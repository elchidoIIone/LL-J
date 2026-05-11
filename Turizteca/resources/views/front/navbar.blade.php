<header class="topbar sticky top-0 z-30">
  <div class="flex items-center gap-3 px-4 py-3">
    <button id="toggleSidebarBtn" class="btn" aria-label="Mostrar/Ocultar menú" title="Mostrar/Ocultar menú">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75 5.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z" clip-rule="evenodd"/></svg>
    </button>
    <div class="hidden sm:block text-sm text-slate-400 mr-auto">Turizteca / <span class="font-medium text-slate-200">@yield('breadcrumb','Resumen')</span></div>
    <a class="btn" href="#" onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
    Salir
</a>

<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display:none;">
    @csrf
</form>
  </div>
</header>
