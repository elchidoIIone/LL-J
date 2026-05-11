@extends('layouts.dashboard')

@section('title', 'Turizteca — Configuración')
@section('breadcrumb', 'Configuración')

@section('content')
  <div class="grid grid-cols-1 gap-4">
    <div class="card">
  <div class="card-header"><div class="text-base font-semibold">Configuración general</div></div>
  <div class="card-body space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label class="text-sm text-slate-300">Etiqueta de patrocinio</label>
           <input class="input mt-1" placeholder="Patrocinado"></div>
      <div><label class="text-sm text-slate-300">Visibilidad por nivel</label>
           <div class="mt-1 grid grid-cols-3 gap-2">
             <input class="input" placeholder="1x">
             <input class="input" placeholder="2x">
             <input class="input" placeholder="3x">
           </div></div>
    </div>
    <button class="btn btn-primary">Guardar cambios</button>
  </div>
</div>
  </div>
@endsection
