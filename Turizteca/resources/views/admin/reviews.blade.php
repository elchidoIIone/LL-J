@extends('layouts.dashboard')

@section('title', 'Turizteca — Reseñas')
@section('breadcrumb', 'Reseñas')

@section('content')
  <div class="grid grid-cols-1 gap-4">
    @if (session('success'))
      <div class="p-3 rounded bg-emerald-600/10 text-emerald-400 border border-emerald-700">
        {{ session('success') }}
      </div>
    @endif

    <div class="card">
      <div class="card-header">
        <div class="text-base font-semibold">Reseñas</div>
      </div>
      <div class="card-body">
        @if ($reviews->count() === 0)
          <div class="text-sm text-slate-400">Aún no hay reseñas.</div>
        @else
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="text-slate-400 text-left border-b border-slate-800">
                <tr>
                  <th class="py-2 pr-4">ID</th>
                  <th class="py-2 pr-4">Restaurante</th>
                  <th class="py-2 pr-4">Usuario</th>
                  <th class="py-2 pr-4">Calificación</th>
                  <th class="py-2 pr-4">Comentario</th>
                  <th class="py-2 pr-0 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                @foreach ($reviews as $rev)
                  <tr>
                    <td class="py-2 pr-4 align-top">#{{ $rev->id }}</td>
                    <td class="py-2 pr-4 align-top">{{ $rev->restaurant?->name ?? '—' }}</td>
                    <td class="py-2 pr-4 align-top">{{ $rev->user?->name ?? '—' }}</td>
                    <td class="py-2 pr-4 align-top">
                      @php $stars = (int) $rev->rating; @endphp
                      <div class="text-yellow-400">
                        @for ($i = 1; $i <= 5; $i++)
                          <span>{{ $i <= $stars ? '★' : '☆' }}</span>
                        @endfor
                      </div>
                    </td>
                    <td class="py-2 pr-4 align-top">{{ $rev->comment ?: '—' }}</td>
                    <td class="py-2 pr-0 align-top text-right">
                      <form action="{{ route('admin.reviews.destroy', $rev) }}"
                            method="POST"
                            onsubmit="return confirm('¿Seguro que deseas eliminar esta reseña?');"
                            class="inline-block">
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
            {{ $reviews->onEachSide(1)->links() }}
          </div>
        @endif
      </div>
    </div>
  </div>
@endsection