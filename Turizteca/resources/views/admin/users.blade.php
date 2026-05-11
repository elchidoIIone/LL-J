@extends('layouts.dashboard')

@section('title', 'Turizteca — Usuarios')
@section('breadcrumb', 'Usuarios')

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
            <div class="text-base font-semibold">Nuevo usuario</div>
        </div>

        <div class="card-body grid grid-cols-1 md:grid-cols-3 gap-4">

            <form action="{{ route('admin.users.store') }}" method="POST">
                @csrf

                <div>
                    <label class="text-sm text-slate-300">Nombre</label>
                    <input name="name" class="input mt-1" value="{{ old('name') }}" maxlength="120" required>
                </div>

                <div>
                    <label class="text-sm text-slate-300">Email</label>
                    <input type="email" name="email" class="input mt-1" value="{{ old('email') }}" maxlength="254" required>
                </div>

                <div>
                    <label class="text-sm text-slate-300">Contraseña</label>
                    <input type="password" name="password" class="input mt-1" minlength="8" required>
                </div>

                <div>
                    <label class="text-sm text-slate-300">Tipo de cuenta</label>
                    <select name="account_type" class="input mt-1" required>
                        @foreach (['customer'=>'Cliente','owner'=>'Propietario','admin'=>'Administrador'] as $k=>$v)
                            <option value="{{ $k }}">{{ $v }}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="text-sm text-slate-300">Presupuesto preferido</label>
                    <select name="preferred_budget" class="input mt-1">
                        <option value="">—</option>
                        @foreach (['low'=>'Bajo','medium'=>'Medio','high'=>'Alto'] as $k=>$v)
                            <option value="{{ $k }}">{{ $v }}</option>
                        @endforeach
                    </select>
                </div>

                <div class="md:col-span-3 mt-4">
                    <button class="btn btn-primary">Guardar</button>
                </div>

            </form>

        </div>
    </div>

    <div class="card">
        <div class="card-header">
            <div class="text-base font-semibold">Usuarios</div>
        </div>

        <div class="card-body">
            @if ($users->count() === 0)
                <div class="text-sm text-slate-400">Crea usuarios o vincula tu almacenamiento.</div>
            @else
                <div class="overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead class="text-slate-400 text-left border-b border-slate-800">
                            <tr>
                                <th class="py-2 pr-4">ID</th>
                                <th class="py-2 pr-4">Nombre</th>
                                <th class="py-2 pr-4">Email</th>
                                <th class="py-2 pr-4">Tipo</th>
                                <th class="py-2 pr-4">Presupuesto</th>
                                <th class="py-2 pr-4">Creado</th>
                                <th class="py-2 pr-0 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-slate-800">
                            @foreach ($users as $u)
                                <tr>
                                    <td class="py-2 pr-4 align-top">#{{ $u->id }}</td>
                                    <td class="py-2 pr-4 align-top">{{ $u->name }}</td>
                                    <td class="py-2 pr-4 align-top">{{ $u->email }}</td>
                                    <td class="py-2 pr-4 align-top capitalize">{{ $u->account_type }}</td>

                                    <td class="py-2 pr-4 align-top">
                                        @php $map = ['low'=>'Bajo','medium'=>'Medio','high'=>'Alto']; @endphp
                                        {{ $u->preferred_budget ? ($map[$u->preferred_budget] ?? $u->preferred_budget) : '—' }}
                                    </td>

                                    <td class="py-2 pr-4 align-top">{{ $u->created_at?->format('d/m/Y H:i') }}</td>

                                    <td class="py-2 pr-0 align-top text-right">
                                        
                                        <details class="inline-block">
                                            <summary class="btn text-xs">Editar</summary>

                                            <div class="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800 w-[28rem] text-left">

                                                <form action="{{ route('admin.users.update', $u->id) }}" method="POST">
                                                    @csrf
                                                    @method('PUT')

                                                    <div class="md:col-span-2">
                                                        <label class="text-xs text-slate-400">Nombre</label>
                                                        <input name="name" class="input mt-1" 
                                                            value="{{ old('name',$u->name) }}" required>
                                                    </div>

                                                    <div class="md:col-span-2">
                                                        <label class="text-xs text-slate-400">Email</label>
                                                        <input type="email" name="email" class="input mt-1"
                                                            value="{{ old('email',$u->email) }}" required>
                                                    </div>

                                                    <div>
                                                        <label class="text-xs text-slate-400">Tipo</label>
                                                        <select name="account_type" class="input mt-1" required>
                                                            @foreach (['customer'=>'Cliente','owner'=>'Propietario','admin'=>'Administrador'] as $k=>$v)
                                                                <option value="{{ $k }}" @selected($u->account_type==$k)>
                                                                    {{ $v }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label class="text-xs text-slate-400">Presupuesto</label>
                                                        <select name="preferred_budget" class="input mt-1">
                                                            <option value="">—</option>
                                                            @foreach (['low'=>'Bajo','medium'=>'Medio','high'=>'Alto'] as $k=>$v)
                                                                <option value="{{ $k }}" @selected($u->preferred_budget==$k)>
                                                                    {{ $v }}
                                                                </option>
                                                            @endforeach
                                                        </select>
                                                    </div>

                                                    <div class="md:col-span-2">
                                                        <label class="text-xs text-slate-400">Nueva contraseña (opcional)</label>
                                                        <input type="password" name="password" class="input mt-1"
                                                            minlength="8" placeholder="Dejar en blanco para no cambiar">
                                                    </div>

                                                    <div class="md:col-span-2 mt-3">
                                                        <button class="btn btn-primary">Actualizar</button>
                                                    </div>

                                                </form>

                                            </div>
                                        </details>

                                        @if (auth()->id() !== $u->id)
                                            <form action="{{ route('admin.users.destroy', $u->id) }}" 
                                                  method="POST" 
                                                  class="inline-block ml-1"
                                                  onsubmit="return confirm('¿Eliminar usuario definitivamente?');">

                                                @csrf
                                                @method('DELETE')

                                                <button class="btn text-xs bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-700">
                                                    Eliminar
                                                </button>

                                            </form>
                                        @endif

                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>

                <div class="mt-4">
                    {{ $users->onEachSide(1)->links() }}
                </div>
            @endif
        </div>
    </div>

</div>
@endsection