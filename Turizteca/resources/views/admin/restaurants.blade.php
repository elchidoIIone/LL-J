@extends('layouts.dashboard')

@section('title', 'Turizteca — Restaurantes')
@section('breadcrumb', 'Restaurantes')

@php use Illuminate\Support\Str; @endphp

@section('content')
  @php
    $cuisines = ['mexican'=>'Mexicana','seafood'=>'Mariscos','italian'=>'Italiana','bbq'=>'BBQ','steakhouse'=>'Steakhouse','vegan'=>'Vegana','vegetariana'=>'Vegetariana','asian'=>'Asiática','japanese'=>'Japonesa','chinese'=>'China','thai'=>'Tailandesa','indian'=>'India','mediterranean'=>'Mediterránea','fast_food'=>'Comida rápida','cafe'=>'Café','bakery'=>'Panadería','tacos'=>'Tacos','pizza'=>'Pizza','burgers'=>'Hamburguesas','bar'=>'Bar','fusion'=>'Fusión','local'=>'Local'];
    $hoursTypes = ['all_day'=>'Todo el día','breakfast_lunch'=>'Desayuno y comida','lunch_dinner'=>'Comida y cena','dinner_only'=>'Solo cena','weekdays_only'=>'Solo entre semana','weekends_only'=>'Solo fines de semana','custom'=>'Personalizado'];
  @endphp

  <div class="grid grid-cols-1 gap-4">
    @if (session('success'))
      <div class="p-3 rounded bg-emerald-600/10 text-emerald-400 border border-emerald-700">
        {{ session('success') }}
      </div>
    @endif

    @if ($errors->any())
      <div class="p-3 rounded bg-red-600/10 text-red-400 border border-red-700">
        <ul class="list-disc pl-5">
          @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
          @endforeach
        </ul>
      </div>
    @endif

    <div class="card">
      <div class="card-header flex items-center justify-between">
        <div class="text-base font-semibold">Nuevo restaurante</div>
      </div>
      <div class="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
        <form action="{{ route('admin.restaurants.store') }}" method="POST">
          @csrf

          <div>
            <label class="text-sm text-slate-300">Propietario</label>
            <select name="owner_id" class="input mt-1" required>
              <option value="">— Selecciona —</option>
              @foreach ($owners as $owner)
                <option value="{{ $owner->id }}" @selected(old('owner_id')==$owner->id)>{{ $owner->name }}</option>
              @endforeach
            </select>
          </div>

          <div>
            <label class="text-sm text-slate-300">Nombre</label>
            <input name="name" class="input mt-1" value="{{ old('name') }}" maxlength="120" required>
          </div>

          <div class="md:col-span-2">
            <label class="text-sm text-slate-300">Descripción</label>
            <textarea name="description" class="input mt-1" rows="2">{{ old('description') }}</textarea>
          </div>

          <div>
            <label class="text-sm text-slate-300">Tipo de cocina</label>
            <select name="cuisine_type" class="input mt-1" required>
              <option value="">— Selecciona —</option>
              @foreach ($cuisines as $key=>$label)
                <option value="{{ $key }}" @selected(old('cuisine_type')==$key)>{{ $label }}</option>
              @endforeach
            </select>
          </div>

          <div>
            <label class="text-sm text-slate-300">Precio promedio (MXN)</label>
            <input type="number" name="average_price" class="input mt-1" value="{{ old('average_price') }}" min="0" placeholder="Ej. 200">
          </div>

          <div>
            <label class="text-sm text-slate-300">Latitud</label>
            <input type="number" step="0.000001" name="location_lat" class="input mt-1" value="{{ old('location_lat') }}" required>
          </div>

          <div>
            <label class="text-sm text-slate-300">Longitud</label>
            <input type="number" step="0.000001" name="location_lng" class="input mt-1" value="{{ old('location_lng') }}" required>
          </div>

          <div>
            <label class="text-sm text-slate-300">Horario</label>
            <select name="opening_hours_type" class="input mt-1" required>
              @foreach ($hoursTypes as $key=>$label)
                <option value="{{ $key }}" @selected(old('opening_hours_type','all_day')==$key)>{{ $label }}</option>
              @endforeach
            </select>
          </div>

          <div>
            <label class="text-sm text-slate-300">Abre a</label>
            <input type="time" name="opens_at" class="input mt-1" value="{{ old('opens_at') }}">
          </div>

          <div>
            <label class="text-sm text-slate-300">Cierra a</label>
            <input type="time" name="closes_at" class="input mt-1" value="{{ old('closes_at') }}">
          </div>

          <div class="md:col-span-2">
            <button class="btn btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="text-base font-semibold">Restaurantes</div>
      </div>
      <div class="card-body">
        @if ($restaurants->count() === 0)
          <div class="text-sm text-slate-400">Tabla vacía. Crea tu primer restaurante.</div>
        @else
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="text-slate-400 text-left border-b border-slate-800">
                <tr>
                  <th class="py-2 pr-4">ID</th>
                  <th class="py-2 pr-4">Nombre</th>
                  <th class="py-2 pr-4">Dueño</th>
                  <th class="py-2 pr-4">Cocina</th>
                  <th class="py-2 pr-4">Precio</th>
                  <th class="py-2 pr-4">Coords</th>
                  <th class="py-2 pr-4">Horario</th>
                  <th class="py-2 pr-4">Rating</th>
                  <th class="py-2 pr-4">Patrocinios</th>
                  <th class="py-2 pr-0 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                @foreach ($restaurants as $r)
                  <tr>
                    <td class="py-2 pr-4 align-top">#{{ $r->id }}</td>

                    <td class="py-2 pr-4 align-top">
                      <div class="font-medium">{{ $r->name }}</div>
                      @if ($r->description)
                        <div class="text-xs text-slate-400">{{ Str::limit($r->description, 90) }}</div>
                      @endif
                    </td>

                    <td class="py-2 pr-4 align-top">{{ $r->owner?->name ?? '—' }}</td>

                    <td class="py-2 pr-4 align-top">{{ $cuisines[$r->cuisine_type] ?? $r->cuisine_type }}</td>

                    <td class="py-2 pr-4 align-top">{{ $r->average_price ? '$'.number_format($r->average_price,0) : '—' }}</td>

                    <td class="py-2 pr-4 align-top">{{ $r->location_lat }}, {{ $r->location_lng }}</td>

                    <td class="py-2 pr-4 align-top">
                      <div>{{ $hoursTypes[$r->opening_hours_type] ?? $r->opening_hours_type }}</div>
                      @if ($r->opens_at || $r->closes_at)
                        <div class="text-xs text-slate-400">{{ $r->opens_at }} - {{ $r->closes_at }}</div>
                      @endif
                    </td>

                    <td class="py-2 pr-4 align-top">
                      {{ $r->reviews_avg_rating ? number_format((float)$r->reviews_avg_rating, 2) : '—' }}
                    </td>

                    <td class="py-2 pr-4 align-top">
                      @if ($r->sponsorships->isEmpty())
                        <span class="text-slate-400">—</span>
                      @else
                        <ul class="list-disc list-inside">
                          @foreach ($r->sponsorships as $sp)
                            <li>{{ $sp->label }} ({{ $sp->visibility_level }})</li>
                          @endforeach
                        </ul>
                      @endif
                    </td>

                    <td class="py-2 pr-0 align-top text-right">
                      <details class="inline-block">
                        <summary class="btn text-xs">Editar</summary>
                        <div class="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800 w-[32rem]">
                          <form action="{{ route('admin.restaurants.update', $r) }}" method="POST" class="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                            @csrf
                            @method('PUT')

                            <div class="md:col-span-2">
                              <label class="text-xs text-slate-400">Nombre</label>
                              <input name="name" class="input mt-1" value="{{ old('name', $r->name) }}" required>
                            </div>

                            <div class="md:col-span-2">
                              <label class="text-xs text-slate-400">Descripción</label>
                              <textarea name="description" class="input mt-1" rows="2">{{ old('description', $r->description) }}</textarea>
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Propietario</label>
                              <select name="owner_id" class="input mt-1" required>
                                @foreach ($owners as $owner)
                                  <option value="{{ $owner->id }}" @selected(old('owner_id',$r->owner_id)==$owner->id)>{{ $owner->name }}</option>
                                @endforeach
                              </select>
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Cocina</label>
                              <select name="cuisine_type" class="input mt-1" required>
                                @foreach ($cuisines as $key=>$label)
                                  <option value="{{ $key }}" @selected(old('cuisine_type',$r->cuisine_type)==$key)>{{ $label }}</option>
                                @endforeach
                              </select>
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Precio promedio</label>
                              <input type="number" name="average_price" class="input mt-1" value="{{ old('average_price',$r->average_price) }}" min="0">
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Latitud</label>
                              <input type="number" step="0.000001" name="location_lat" class="input mt-1" value="{{ old('location_lat',$r->location_lat) }}" required>
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Longitud</label>
                              <input type="number" step="0.000001" name="location_lng" class="input mt-1" value="{{ old('location_lng',$r->location_lng) }}" required>
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Horario</label>
                              <select name="opening_hours_type" class="input mt-1" required>
                                @foreach ($hoursTypes as $key=>$label)
                                  <option value="{{ $key }}" @selected(old('opening_hours_type',$r->opening_hours_type)==$key)>{{ $label }}</option>
                                @endforeach
                              </select>
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Abre</label>
                              <input type="time" name="opens_at" class="input mt-1" value="{{ old('opens_at',$r->opens_at) }}">
                            </div>

                            <div>
                              <label class="text-xs text-slate-400">Cierra</label>
                              <input type="time" name="closes_at" class="input mt-1" value="{{ old('closes_at',$r->closes_at) }}">
                            </div>

                            <div class="md:col-span-2">
                              <button class="btn btn-primary">Actualizar</button>
                            </div>
                          </form>
                        </div>
                      </details>

                      <form action="{{ route('admin.restaurants.destroy', $r) }}" method="POST" class="inline-block"
                            onsubmit="return confirm('¿Eliminar restaurante #{{ $r->id }} definitivamente?');">
                        @csrf
                        @method('DELETE')
                        <button class="btn text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700 ml-1">Eliminar</button>
                      </form>
                    </td>
                  </tr>
                @endforeach
              </tbody>
            </table>
          </div>

          <div class="mt-4">
            {{ $restaurants->onEachSide(1)->links() }}
          </div>
        @endif
      </div>
    </div>
  </div>
@endsection