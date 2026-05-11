@extends('layouts.dashboard')

@section('title', 'Turizteca — Patrocinios')
@section('breadcrumb', 'Patrocinios')

@section('content')
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
        <div class="card-header">
            <div class="text-base font-semibold">Nuevo patrocinio</div>
        </div>

        <div class="card-body grid grid-cols-1 md:grid-cols-3 gap-4">

            <form action="{{ route('admin.sponsorships.store') }}" method="POST" class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                @csrf

                <div>
                    <label class="text-sm text-slate-300">Restaurante</label>
                    <select name="restaurant_id" class="input mt-1" required>
                        <option value="">— Selecciona —</option>
                        @foreach ($restaurants as $res)
                            <option value="{{ $res->id }}" @selected(old('restaurant_id') == $res->id)>
                                {{ $res->name }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="text-sm text-slate-300">Nivel de visibilidad</label>
                    <select name="visibility_level" class="input mt-1" required>
                        @foreach (['low'=>'Bajo','medium'=>'Medio','high'=>'Alto'] as $key => $label)
                            <option value="{{ $key }}" @selected(old('visibility_level') == $key)>
                                {{ $label }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="text-sm text-slate-300">Etiqueta</label>
                    <input name="label" class="input mt-1" value="{{ old('label', 'Patrocinado') }}" maxlength="30">
                </div>

                <div class="md:col-span-3">
                    <button class="btn btn-primary">Guardar</button>
                </div>

            </form>

        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <div class="text-base font-semibold">Patrocinios</div>
        </div>

        <div class="card-body">

            @if ($sponsorships->count() === 0)
                <div class="text-sm text-slate-400">Sin patrocinios aún.</div>
            @else

                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead class="text-slate-400 text-left border-b border-slate-800">
                            <tr>
                                <th class="py-2 pr-4">ID</th>
                                <th class="py-2 pr-4">Restaurante</th>
                                <th class="py-2 pr-4">Visibilidad</th>
                                <th class="py-2 pr-4">Etiqueta</th>
                                <th class="py-2 pr-4">Creado</th>
                                <th class="py-2 pr-0 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-slate-800">
                            @foreach ($sponsorships as $s)
                                <tr>
                                    <td class="py-2 pr-4 align-top">#{{ $s->id }}</td>
                                    <td class="py-2 pr-4 align-top">{{ $s->restaurant?->name ?? '—' }}</td>

                                    <td class="py-2 pr-4 align-top">
                                        @php $map = ['low'=>'Bajo','medium'=>'Medio','high'=>'Alto']; @endphp
                                        {{ $map[$s->visibility_level] ?? $s->visibility_level }}
                                    </td>

                                    <td class="py-2 pr-4 align-top">{{ $s->label }}</td>

                                    <td class="py-2 pr-4 align-top">
                                        {{ $s->created_at?->format('d/m/Y H:i') }}
                                    </td>

                                    <td class="py-2 pr-0 align-top text-right">

                                        <form action="{{ route('admin.sponsorships.destroy', $s) }}"
                                              method="POST"
                                              class="inline-block"
                                              onsubmit="return confirm('¿Eliminar patrocinio definitivamente?');">

                                            @csrf
                                            @method('DELETE')

                                            <button class="btn text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700">
                                                Eliminar
                                            </button>

                                        </form>

                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <div class="mt-4">
                    {{ $sponsorships->onEachSide(1)->links() }}
                </div>

            @endif

        </div>
    </div>

</div>
@endsection