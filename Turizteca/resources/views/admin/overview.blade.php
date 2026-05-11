@extends('layouts.dashboard')

@section('title', 'Turizteca — Resumen')
@section('breadcrumb', 'Resumen')

@section('content')
  <div class="grid grid-cols-1 gap-4">
    @if (session('success'))
      <div class="p-3 rounded bg-emerald-600/10 text-emerald-400 border border-emerald-700">
        {{ session('success') }}
      </div>
    @endif

    {{-- KPI cards --}}
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div class="card p-5">
        <div class="text-sm muted">Restaurantes totales</div>
        <div class="mt-2 text-3xl font-semibold">{{ $totalRestaurants }}</div>
      </div>

      <div class="card p-5">
        <div class="text-sm muted">Patrocinios activos</div>
        <div class="mt-2 text-3xl font-semibold">{{ $activeSponsorships }}</div>
      </div>

      <div class="card p-5">
        <div class="text-sm muted">Calificación promedio</div>
        <div class="mt-2 text-3xl font-semibold">
          {{ $averageRating ? number_format((float) $averageRating, 2) : '—' }}
        </div>
      </div>

      <div class="card p-5">
        <div class="text-sm muted">Usuarios registrados</div>
        <div class="mt-2 text-3xl font-semibold">{{ $registeredUsers }}</div>
      </div>
    </div>

    {{-- Charts --}}
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {{-- Composición de patrocinios (bar chart) --}}
      <div class="card col-span-1 xl:col-span-2">
        <div class="card-header">
          <div class="text-base font-semibold">Composición de patrocinios por nivel</div>
        </div>
        <div class="card-body" style="height:320px">
          <canvas id="chartSponsorships"></canvas>
        </div>
      </div>

      {{-- Distribución por tipo de cocina (doughnut) --}}
      <div class="card">
        <div class="card-header">
          <div class="text-base font-semibold">Distribución por tipo de cocina</div>
        </div>
        <div class="card-body" style="height:300px">
          <canvas id="chartCuisines"></canvas>
        </div>
      </div>
    </div>

    {{-- Mapa --}}
    <div class="card">
      <div class="card-header">
        <div class="text-base font-semibold">Mapa de restaurantes</div>
      </div>
      <div class="card-body">
        <div id="map" class="h-[380px] w-full rounded-lg overflow-hidden"></div>
        <p class="text-xs muted mt-2">
          Mapa base: © <a class="underline" href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>
          • Tiles: © <a class="underline" href="https://carto.com/attributions" target="_blank">CARTO</a>
        </p>
      </div>
    </div>
  </div>
@endsection

{{-- ========================= --}}
{{-- Assets & Rendering (Stacks) --}}
{{-- ========================= --}}

@push('styles')
  {{-- Leaflet CSS --}}
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
@endpush

@push('scripts')
  {{-- Chart.js --}}
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  {{-- Leaflet JS --}}
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  {{-- Expose server data (Blade parses here safely) --}}
  <script>
    window.OVERVIEW = {
      cuisines: @json($cuisineDistribution ?? []),       // [{cuisine_type, total}, ...]
      restaurants: @json($restaurantsForMap ?? []),      // [{name,cuisine_type,average_price,location_lat,location_lng}, ...]
      levels: @json($sponsorshipLevels ?? (object)[]),   // {1: N, 2: N, 3: N}  <-- IMPORTANT: (object)[]
    };
  </script>

  {{-- Rendering (plain JS; no template strings; no destructuring) --}}
  <script>
    (function () {
      var data = window.OVERVIEW || {};
      var CUISINE_RAW = Array.isArray(data.cuisines) ? data.cuisines : [];
      var RESTAURANTS = Array.isArray(data.restaurants) ? data.restaurants : [];
      var LEVELS = (data.levels && typeof data.levels === 'object') ? data.levels : {};

      function moneyMXN(n) {
        try {
          return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 })
            .format(Number(n || 0));
        } catch (e) {
          return '$' + (Number(n || 0) | 0);
        }
      }

      function labelCuisine(c) {
        c = (c || '').replace(/_/g, ' ');
        return c.replace(/\b\w/g, function (m) { return m.toUpperCase(); });
      }

      // ===== Bar: Composición de patrocinios por nivel =====
      (function renderSponsorships(){
        var el = document.getElementById('chartSponsorships');
        if (!el) return;

        var values = [
          Number(LEVELS[1] || 0),
          Number(LEVELS[2] || 0),
          Number(LEVELS[3] || 0)
        ];
        var labels = ['Bajo (1)', 'Medio (2)', 'Alto (3)'];
        var colors = ['#fbbf24', '#34d399', '#60a5fa'];

        if ((values[0] + values[1] + values[2]) === 0) {
          el.insertAdjacentHTML('afterend',
            '<div class="text-sm text-slate-400 mt-2">No hay patrocinios registrados.</div>');
          return;
        }

        new Chart(el, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Patrocinios',
              data: values,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(148,163,184,0.15)' } },
              y: { beginAtZero: true, ticks: { color: '#cbd5e1', precision: 0, stepSize: 1 },
                   grid: { color: 'rgba(148,163,184,0.15)' } }
            }
          }
        });
      })();

      // ===== Doughnut: Distribución por tipo de cocina =====
      (function renderCuisines(){
        var el = document.getElementById('chartCuisines');
        if (!el) return;

        var labels = [];
        var values = [];
        for (var i = 0; i < CUISINE_RAW.length; i++) {
          var r = CUISINE_RAW[i] || {};
          labels.push(labelCuisine(r.cuisine_type || '—'));
          values.push(Number(r.total || 0));
        }

        var sum = 0;
        for (var j = 0; j < values.length; j++) sum += values[j];
        if (!labels.length || sum === 0) {
          el.insertAdjacentHTML('afterend',
            '<div class="text-sm text-slate-400 mt-2">Sin datos por ahora.</div>');
          return;
        }

        var colors = [];
        for (var k = 0; k < labels.length; k++) {
          var hue = (k * 25) % 360;
          colors.push('hsl(' + hue + ' 75% 55%)');
        }

        new Chart(el, {
          type: 'doughnut',
          data: { labels: labels, datasets: [{ data: values, backgroundColor: colors }] },
          options: {
            plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1' } } }
          }
        });
      })();

      // ===== Map: Leaflet =====
      (function renderMap(){
        var el = document.getElementById('map');
        if (!el) return;

        var map = L.map(el, { zoomControl: false });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO'
        }).addTo(map);

        var layer = L.layerGroup().addTo(map);
        var bounds = L.latLngBounds();

        for (var i = 0; i < RESTAURANTS.length; i++) {
          var r = RESTAURANTS[i] || {};
          var lat = Number(r.location_lat);
          var lng = Number(r.location_lng);
          if (!isFinite(lat) || !isFinite(lng)) continue;

        var marker = L.circleMarker([lat, lng], {
            radius: 6, color: '#3b82f6', weight: 2, fillColor: '#93c5fd', fillOpacity: 0.9
          });

          var priceTxt = (r.average_price != null) ? moneyMXN(r.average_price) : '—';
          var html = ''
            + '<div style="min-width:200px">'
            +   '<strong>' + (r.name || 'Restaurante') + '</strong><br/>'
            +   '<span style="color:#cbd5e1">' + labelCuisine(r.cuisine_type) + '</span><br/>'
            +   '<span style="color:#94a3b8">Precio: ' + priceTxt + '</span>'
            + '</div>';

          marker.bindPopup(html);
          marker.addTo(layer);
          bounds.extend([lat, lng]);
        }

        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
        } else {
          map.setView([23.6345, -102.5528], 5); // Centro de MX
        }

        setTimeout(function(){ map.invalidateSize(); }, 100);
      })();

    })();
  </script>
@endpush