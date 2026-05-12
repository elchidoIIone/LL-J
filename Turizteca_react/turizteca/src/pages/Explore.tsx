import { useState, useEffect, useCallback, useRef } from 'react';
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRestaurants } from '../api';
import type { Restaurant, CuisineType } from '../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../types';
import BottomNav from '../components/layout/BottomNav';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const DEFAULT_CENTER = { longitude: -96.9, latitude: 23, zoom: 4.8 };

// Límites que permiten ver México + un poco de vecinos para el efecto "bloqueado"
const MEXICO_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-122, 10],
  [-82, 35],
];

// Capas que grisan todo excepto México (efecto "bloqueado")
const NON_MX_FILL = {
  id: 'non-mexico-fill',
  type: 'fill' as const,
  'source-layer': 'country_boundaries',
  filter: ['!=', ['get', 'iso_3166_1'], 'MX'],
  paint: { 'fill-color': '#b0b0b8', 'fill-opacity': 0.72 },
};

const NON_MX_LINE = {
  id: 'non-mexico-line',
  type: 'line' as const,
  'source-layer': 'country_boundaries',
  filter: ['!=', ['get', 'iso_3166_1'], 'MX'],
  paint: { 'line-color': '#888898', 'line-opacity': 0.5, 'line-width': 0.8 },
};

// Marcadores "Próximamente" en países vecinos visibles
const COMING_SOON = [
  { lng: -104.5, lat: 31.2, name: 'EE.UU.' },
  { lng: -91, lat: 14.4, name: 'Centroamérica' },
  { lng: -80, lat: 22.5, name: 'Caribe' },
];

const CUISINE_FILTERS: { key: CuisineType | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'mexican', label: 'Mexicana' },
  { key: 'seafood', label: 'Mariscos' },
  { key: 'cafe', label: 'Café' },
  { key: 'italian', label: 'Italiana' },
  { key: 'vegan', label: 'Vegana' },
];

export default function Explore() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mapRef = useRef<MapRef>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [filter, setFilter] = useState<CuisineType | 'all'>('all');

  // Si venimos de "Ver en mapa", abrir centrado en ese restaurante
  const urlLat = parseFloat(searchParams.get('lat') ?? '');
  const urlLng = parseFloat(searchParams.get('lng') ?? '');
  const urlRid = parseInt(searchParams.get('rid') ?? '');
  const hasUrlLocation = !isNaN(urlLat) && !isNaN(urlLng);

  const [viewState, setViewState] = useState(
    hasUrlLocation
      ? { longitude: urlLng, latitude: urlLat, zoom: 15 }
      : DEFAULT_CENTER
  );
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    getRestaurants()
      .then(res => {
        const list: Restaurant[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        setRestaurants(list);
        // Auto-seleccionar el restaurante si venimos de "Ver en mapa"
        if (!isNaN(urlRid)) {
          const target = list.find(r => r.id === urlRid);
          if (target) setSelected(target);
        }
      })
      .catch(() => {});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        setUserLocation({ lng, lat });
        // Solo volar a la ubicación si el usuario está dentro de México y no hay URL params
        const inMexico = lng >= -118.5 && lng <= -86.7 && lat >= 14.5 && lat <= 32.7;
        if (inMexico && !hasUrlLocation) {
          setViewState(v => ({ ...v, longitude: lng, latitude: lat, zoom: 12 }));
        }
      });
    }
  }, []);

  const mapped = restaurants.filter(r =>
    r.location_lat && r.location_lng &&
    (filter === 'all' || r.cuisine_type === filter)
  );

  const handleMarkerClick = useCallback((r: Restaurant) => {
    setSelected(r);
    if (r.location_lat && r.location_lng) {
      mapRef.current?.flyTo({
        center: [r.location_lng!, r.location_lat!],
        zoom: 15,
        padding: { top: 120, bottom: 240, left: 20, right: 20 },
        duration: 600,
      });
    }
  }, []);

  return (
    <div className="h-screen w-full relative">
      {/* Mapa */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={e => setViewState(e.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        maxBounds={MEXICO_MAX_BOUNDS}
        minZoom={4.2}
      >
        {/* Overlay oscuro en todos los países excepto México */}
        <Source id="country-boundaries" type="vector" url="mapbox://mapbox.country-boundaries-v1">
          <Layer {...NON_MX_FILL} />
          <Layer {...NON_MX_LINE} />
        </Source>

        {/* Marcadores "Próximamente" en países vecinos */}
        {COMING_SOON.map(cs => (
          <Marker key={cs.name} longitude={cs.lng} latitude={cs.lat}>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shadow-xl border pointer-events-none select-none"
              style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'rgba(136,136,152,0.5)' }}
            >
              <span className="text-sm">🔒</span>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest leading-none" style={{ color: '#444455' }}>
                  {cs.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#888898' }}>
                  Próximamente
                </p>
              </div>
            </div>
          </Marker>
        ))}

        {userLocation && (
          <Marker longitude={userLocation.lng} latitude={userLocation.lat}>
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-md animate-pulse"
              style={{ background: '#1B7A6E' }}
            />
          </Marker>
        )}

        {mapped.map(r => {
          const isSelected = selected?.id === r.id;
          return (
            <Marker
              key={r.id}
              longitude={r.location_lng!}
              latitude={r.location_lat!}
              anchor="bottom"
              onClick={e => { e.originalEvent.stopPropagation(); handleMarkerClick(r); }}
            >
              <div className={`flex flex-col items-center cursor-pointer transition-transform ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                <div
                  className="w-11 h-11 rounded-full shadow-lg flex items-center justify-center text-xl border-2 transition-colors"
                  style={{
                    background: isSelected ? '#C4501A' : '#FBF4E8',
                    borderColor: isSelected ? '#FBF4E8' : '#DCA079',
                  }}
                >
                  {CUISINE_EMOJI[r.cuisine_type] || '🍽️'}
                </div>
                <div
                  className="w-0 h-0 -mt-px"
                  style={{
                    borderLeft: '5px solid transparent',
                    borderRight: '5px solid transparent',
                    borderTop: `8px solid ${isSelected ? '#9E3D00' : '#FBF4E8'}`,
                    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
                  }}
                />
              </div>
            </Marker>
          );
        })}

        {selected && selected.location_lat && selected.location_lng && (
          <Popup
            longitude={selected.location_lng}
            latitude={selected.location_lat}
            onClose={() => setSelected(null)}
            closeButton={false}
            anchor="bottom"
            offset={58}
          >
            <div
              className="bg-white rounded-2xl p-3 shadow-xl flex gap-3 cursor-pointer w-64 border border-outline-variant/20"
              onClick={() => navigate(`/restaurant/${selected.id}`)}
            >
              <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-3xl flex-shrink-0">
                {CUISINE_EMOJI[selected.cuisine_type] || '🍽️'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold font-label uppercase tracking-tighter text-secondary">
                  {CUISINE_LABELS[selected.cuisine_type]}
                </span>
                <h3 className="font-headline text-sm font-bold text-on-surface leading-tight truncate">
                  {selected.name}
                </h3>
                {(selected.avg_rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <span
                      className="material-symbols-outlined text-xs text-tertiary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-[10px] font-bold text-on-surface">
                      {selected.avg_rating?.toFixed(1)}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-primary font-bold mt-1 block">Ver detalles →</span>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Top bar obsidiana */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-5 py-3 obsidian-nav aztec-border-b shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      >
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors active:scale-90 text-on-dark"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <span className="font-headline text-xl font-black tracking-tight text-on-dark">
          Explorar
        </span>

        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-on-dark text-xs font-bold transition-colors"
          style={{
            background: showFilters ? '#C4501A' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <span className="material-symbols-outlined text-sm">tune</span>
          <span className="font-label uppercase tracking-widest text-[10px]">Filtros</span>
        </button>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="absolute top-[68px] left-0 right-0 z-10 flex gap-2 overflow-x-auto hide-scrollbar px-5 py-3 bg-[#2A1200]/95 backdrop-blur-sm border-b border-white/10">
          {CUISINE_FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-none px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border ${
                  active ? 'text-on-primary border-transparent' : 'text-[#FBF4E8] border-white/15 bg-white/5'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #C4501A, #E8723C)' } : {}}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Botón "Buscar aquí" */}
      <div className={`absolute ${showFilters ? 'top-32' : 'top-24'} left-1/2 -translate-x-1/2 z-10 transition-all`}>
        <button
          className="px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 font-label font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-on-primary"
          style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
        >
          <span className="material-symbols-outlined text-base">refresh</span>
          Buscar aquí
        </button>
      </div>

      {/* Carrusel inferior */}
      {mapped.length > 0 && (
        <div className="absolute bottom-24 left-0 w-full z-10">
          <div className="flex gap-3 overflow-x-auto px-5 hide-scrollbar snap-x">
            {mapped.map(r => {
              const active = selected?.id === r.id;
              return (
                <div
                  key={r.id}
                  className={`min-w-[270px] snap-center bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl flex gap-3 cursor-pointer transition-all border ${
                    active ? 'border-primary ring-2 ring-primary/30' : 'border-outline-variant/20'
                  }`}
                  onClick={() => handleMarkerClick(r)}
                >
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 bg-gradient-to-br from-surface-container to-surface-dim"
                  >
                    {CUISINE_EMOJI[r.cuisine_type] || '🍽️'}
                  </div>
                  <div className="flex flex-col justify-center py-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-1 h-1 rounded-full bg-secondary" />
                      <span className="text-[9px] font-bold font-label uppercase tracking-widest text-secondary">
                        {CUISINE_LABELS[r.cuisine_type]}
                      </span>
                    </div>
                    <h3 className="font-headline text-sm text-on-surface font-bold leading-tight truncate">
                      {r.name}
                    </h3>
                    <button
                      className="text-xs font-bold text-primary mt-1 text-left hover:underline flex items-center gap-0.5"
                      onClick={e => { e.stopPropagation(); navigate(`/restaurant/${r.id}`); }}
                    >
                      Ver detalle
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Controles de zoom */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button
          className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-primary active:scale-90 transition-transform border border-outline-variant/20"
          onClick={() => mapRef.current?.zoomIn()}
          aria-label="Acercar"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button
          className="w-11 h-11 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-primary active:scale-90 transition-transform border border-outline-variant/20"
          onClick={() => mapRef.current?.zoomOut()}
          aria-label="Alejar"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        {userLocation && (
          <button
            className="w-11 h-11 text-on-primary rounded-full shadow-lg flex items-center justify-center mt-3 active:scale-90 transition-transform"
            style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
            onClick={() => mapRef.current?.flyTo({
              center: [userLocation.lng, userLocation.lat],
              zoom: 13,
              duration: 600,
            })}
            aria-label="Mi ubicación"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
