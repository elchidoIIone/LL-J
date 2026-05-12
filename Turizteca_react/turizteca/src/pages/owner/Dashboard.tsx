import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MapGL, { Marker } from 'react-map-gl/mapbox';
import type { MapRef, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getRestaurants, createRestaurant, deleteRestaurant } from '../../api';
import type { Restaurant, RestaurantFormData, CuisineType } from '../../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../../types';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import AztecDivider from '../../components/ui/AztecDivider';
import AztecStamp from '../../components/ui/AztecStamp';
import { useAuth } from '../../context/AuthContext';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const CUISINES = Object.entries(CUISINE_LABELS) as [CuisineType, string][];

const EMPTY_FORM: RestaurantFormData = {
  name: '',
  description: '',
  cuisine_type: 'mexican',
  average_price: 150,
  location_lat: 19.4326,
  location_lng: -99.1332,
  opening_hours_type: 'all_day',
  opens_at: '08:00',
  closes_at: '22:00',
};

export default function OwnerDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RestaurantFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const pickerMapRef = useRef<MapRef>(null);
  const [pickerView, setPickerView] = useState({
    longitude: -99.1332,
    latitude: 19.4326,
    zoom: 12,
  });
  const [geoSearch, setGeoSearch] = useState('');
  const [geoResults, setGeoResults] = useState<{ place_name: string; center: [number, number] }[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.account_type !== 'owner' && user?.account_type !== 'admin') {
      navigate('/');
      return;
    }
    fetchMyRestaurants();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (showForm && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lng = pos.coords.longitude;
        const lat = pos.coords.latitude;
        setPickerView(v => ({ ...v, longitude: lng, latitude: lat }));
        setForm(f => ({ ...f, location_lat: lat, location_lng: lng }));
      });
    }
  }, [showForm]);

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    const { lng, lat } = e.lngLat;
    setForm(f => ({ ...f, location_lat: lat, location_lng: lng }));
  }, []);

  const handleGeoSearch = async () => {
    if (!geoSearch.trim() || !MAPBOX_TOKEN) return;
    setGeoLoading(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(geoSearch)}.json?access_token=${MAPBOX_TOKEN}&limit=5&language=es`
      );
      const data = await res.json();
      setGeoResults(
        (data.features ?? []).map((f: { place_name: string; center: [number, number] }) => ({
          place_name: f.place_name,
          center: f.center,
        }))
      );
    } finally {
      setGeoLoading(false);
    }
  };

  const handleGeoSelect = (result: { place_name: string; center: [number, number] }) => {
    const [lng, lat] = result.center;
    setPickerView(v => ({ ...v, longitude: lng, latitude: lat, zoom: 13 }));
    setForm(f => ({ ...f, location_lat: lat, location_lng: lng }));
    setGeoResults([]);
    setGeoSearch(result.place_name);
  };

  const fetchMyRestaurants = () => {
    getRestaurants()
      .then(res => {
        const all: Restaurant[] = Array.isArray(res.data)
          ? res.data
          : (res.data.data ?? []);
        setRestaurants(all.filter(r => r.owner_id === user?.id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const isInMexico = (lat: number, lng: number) =>
    lat >= 14.5 && lat <= 32.7 && lng >= -118.4 && lng <= -86.7;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isInMexico(form.location_lat, form.location_lng)) {
      setFormError('La ubicación del restaurante debe estar dentro de México. Por favor mueve el pin al lugar correcto.');
      return;
    }

    setSubmitting(true);
    try {
      await createRestaurant({ ...form, owner_id: user!.id });
      setSuccess('¡Restaurante publicado exitosamente!');
      setShowForm(false);
      setForm(EMPTY_FORM);
      fetchMyRestaurants();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;
      if (msg?.errors) {
        const first = Object.values(msg.errors)[0];
        setFormError(Array.isArray(first) ? first[0] : String(first));
      } else {
        setFormError(msg?.message || 'Error al crear restaurante');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteRestaurant(id);
      setRestaurants(prev => prev.filter(r => r.id !== id));
      setSuccess('Restaurante eliminado');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      alert('Error al eliminar el restaurante');
    }
  };

  const update = (key: keyof RestaurantFormData, value: unknown) =>
    setForm(f => ({ ...f, [key]: value }));

  const sponsoredCount = restaurants.filter(r => r.sponsorship).length;

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <div className="pt-16">
        {/* Hero oscuro */}
        <div
          className="px-6 pt-8 pb-8"
          style={{ background: 'linear-gradient(180deg, #1A0800 0%, #2A1200 100%)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-px bg-[#C4501A]" />
            <span className="font-label text-[#E8723C] uppercase tracking-widest text-[10px] font-bold">
              Panel de propietario
            </span>
          </div>

          <h2 className="font-headline text-3xl font-black text-[#FBF4E8] tracking-tight">
            Mis Restaurantes
          </h2>
          <p className="text-[#C4A882] text-sm mt-1">
            {restaurants.length === 0
              ? 'Aún no has publicado ningún restaurante'
              : `${restaurants.length} ${restaurants.length === 1 ? 'restaurante publicado' : 'restaurantes publicados'}`}
          </p>

          {/* Stats */}
          {!loading && restaurants.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-5">
              <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
                <p className="text-[#FBF4E8] font-headline font-black text-2xl leading-none">
                  {restaurants.length}
                </p>
                <p className="text-[#C4A882] text-[10px] uppercase tracking-widest font-bold mt-1">
                  Activos
                </p>
              </div>
              <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
                <p className="font-headline font-black text-2xl leading-none" style={{ color: '#D4960A' }}>
                  {sponsoredCount}
                </p>
                <p className="text-[#C4A882] text-[10px] uppercase tracking-widest font-bold mt-1">
                  Promocionados
                </p>
              </div>
            </div>
          )}

          {/* CTA principal */}
          <button
            onClick={() => { setShowForm(f => !f); setFormError(''); }}
            className="mt-5 w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform text-on-primary"
            style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
          >
            <span className="material-symbols-outlined text-sm">
              {showForm ? 'close' : 'add'}
            </span>
            {showForm ? 'Cancelar' : 'Publicar nuevo restaurante'}
          </button>
        </div>

        <div style={{ background: '#2A1200' }}>
          <AztecDivider color="#FBF4E8" />
        </div>
        <div
          style={{
            height: '24px',
            background: '#FBF4E8',
            borderRadius: '28px 28px 0 0',
            marginTop: '-2px',
          }}
        />

        <div className="px-6 max-w-2xl mx-auto -mt-2 pb-4">

          {success && (
            <div
              className="rounded-xl p-3 flex items-center gap-2 mb-4 border"
              style={{
                background: 'rgba(27, 122, 110, 0.12)',
                borderColor: 'rgba(27, 122, 110, 0.3)',
              }}
            >
              <span
                className="material-symbols-outlined text-sm text-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <p className="text-secondary font-label font-bold text-sm">{success}</p>
            </div>
          )}

          {/* Formulario de creación */}
          {showForm && (
            <form
              onSubmit={handleCreate}
              className="bg-white rounded-2xl p-6 border border-outline-variant/20 shadow-md mb-6 space-y-4"
            >
              <div>
                <span className="font-label text-tertiary uppercase tracking-widest text-[10px] font-bold block mb-1">
                  Nuevo lugar
                </span>
                <h3 className="font-headline text-xl font-bold text-on-surface">
                  Publicar restaurante
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-on-surface-variant font-label uppercase tracking-widest mb-1.5 block">
                    Nombre del restaurante *
                  </label>
                  <input
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm transition-colors"
                    placeholder="Ej: La Cocina de María"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-on-surface-variant font-label uppercase tracking-widest mb-1.5 block">
                    Descripción
                  </label>
                  <textarea
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm resize-none transition-colors"
                    rows={2}
                    placeholder="Describe tu restaurante..."
                    value={form.description}
                    onChange={e => update('description', e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant font-label uppercase tracking-widest mb-1.5 block">
                    Tipo de cocina *
                  </label>
                  <select
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm transition-colors"
                    value={form.cuisine_type}
                    onChange={e => update('cuisine_type', e.target.value as CuisineType)}
                    required
                  >
                    {CUISINES.map(([val, label]) => (
                      <option key={val} value={val}>
                        {CUISINE_EMOJI[val]} {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant font-label uppercase tracking-widest mb-1.5 block">
                    Precio promedio (MXN) *
                  </label>
                  <input
                    type="number"
                    min={10}
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm transition-colors"
                    value={form.average_price}
                    onChange={e => update('average_price', Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant font-label uppercase tracking-widest mb-1.5 block">
                    Abre a las
                  </label>
                  <input
                    type="time"
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm transition-colors"
                    value={form.opens_at}
                    onChange={e => update('opens_at', e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-on-surface-variant font-label uppercase tracking-widest mb-1.5 block">
                    Cierra a las
                  </label>
                  <input
                    type="time"
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm transition-colors"
                    value={form.closes_at}
                    onChange={e => update('closes_at', e.target.value)}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold text-on-surface-variant font-label uppercase tracking-widest mb-1.5 block flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                    Ubicación — toca el mapa para colocar el pin
                  </label>
                  <div className="flex gap-2 mb-2 relative">
                    <input
                      type="text"
                      className="flex-1 bg-surface-container-low rounded-xl px-3 py-2 text-sm outline-none border border-outline-variant/20 focus:border-primary transition-colors"
                      placeholder="Buscar ciudad o dirección..."
                      value={geoSearch}
                      onChange={e => { setGeoSearch(e.target.value); setGeoResults([]); }}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleGeoSearch(); } }}
                    />
                    <button
                      type="button"
                      onClick={handleGeoSearch}
                      disabled={geoLoading}
                      className="px-3 py-2 rounded-xl text-on-primary font-bold text-sm disabled:opacity-60 flex items-center justify-center"
                      style={{ background: '#C4501A' }}
                    >
                      {geoLoading
                        ? <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                        : <span className="material-symbols-outlined text-sm">search</span>
                      }
                    </button>
                    {geoResults.length > 0 && (
                      <div className="absolute top-full left-0 right-12 z-10 bg-white border border-outline-variant/20 rounded-xl shadow-lg overflow-hidden mt-1">
                        {geoResults.map((r, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleGeoSelect(r)}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-surface-container transition-colors border-b border-outline-variant/10 last:border-0 flex items-start gap-2"
                          >
                            <span className="material-symbols-outlined text-sm text-primary shrink-0 mt-0.5">location_on</span>
                            <span className="truncate">{r.place_name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className="relative w-full rounded-xl overflow-hidden border border-outline-variant/20"
                    style={{ height: 240 }}
                  >
                    <MapGL
                      ref={pickerMapRef}
                      {...pickerView}
                      onMove={e => setPickerView(e.viewState)}
                      onClick={handleMapClick}
                      mapStyle="mapbox://styles/mapbox/streets-v12"
                      mapboxAccessToken={MAPBOX_TOKEN}
                      style={{ width: '100%', height: '100%' }}
                      attributionControl={false}
                    >
                      {form.location_lat && form.location_lng && (
                        <Marker
                          longitude={form.location_lng}
                          latitude={form.location_lat}
                          anchor="bottom"
                        >
                          <div className="flex flex-col items-center animate-bounce">
                            <div
                              className="w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-lg border-2 border-white"
                              style={{ background: '#C4501A' }}
                            >
                              📍
                            </div>
                            <div
                              className="w-0 h-0 -mt-px"
                              style={{
                                borderLeft: '5px solid transparent',
                                borderRight: '5px solid transparent',
                                borderTop: '8px solid #9E3D00',
                              }}
                            />
                          </div>
                        </Marker>
                      )}
                    </MapGL>
                    <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[10px] font-mono text-on-surface-variant shadow">
                      {form.location_lat.toFixed(5)}, {form.location_lng.toFixed(5)}
                    </div>
                    {!isInMexico(form.location_lat, form.location_lng) && (
                      <div className="absolute top-2 left-2 right-2 bg-error/90 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white flex items-center gap-1.5 shadow">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                        El pin está fuera de México
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {formError && (
                <div className="bg-error-container/20 border border-error/20 rounded-xl p-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-sm">error</span>
                  <p className="text-error text-sm">{formError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full text-on-primary py-3.5 rounded-xl font-bold shadow-md disabled:opacity-60 active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Publicando...
                  </span>
                ) : (
                  '🚀 Publicar restaurante'
                )}
              </button>
            </form>
          )}

          {/* Lista de restaurantes */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-24 rounded-2xl bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : restaurants.length > 0 ? (
            <div className="space-y-3">
              {restaurants.map(r => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-4 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <AztecStamp color="#C4501A" size={64}>
                      <span className="text-2xl">{CUISINE_EMOJI[r.cuisine_type] || '🍽️'}</span>
                    </AztecStamp>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-headline font-bold text-on-surface leading-tight truncate">
                        {r.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-label mt-0.5">
                        {CUISINE_LABELS[r.cuisine_type]} · ${r.average_price} MXN
                      </p>
                      {r.sponsorship ? (
                        <span
                          className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter text-on-primary"
                          style={{
                            background: r.sponsorship.visibility_level === 'premium' ? '#D4960A' : '#1B7A6E',
                          }}
                        >
                          <span
                            className="material-symbols-outlined text-[10px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          {r.sponsorship.label}
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate(`/sponsorship/${r.id}`)}
                          className="mt-1.5 text-[10px] font-black text-primary flex items-center gap-0.5 hover:underline uppercase tracking-tighter"
                        >
                          <span className="material-symbols-outlined text-[12px]">rocket_launch</span>
                          Promocionar
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => navigate(`/restaurant/${r.id}`)}
                        className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                        aria-label="Ver restaurante"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.name)}
                        className="w-9 h-9 rounded-full bg-error-container/20 flex items-center justify-center text-error hover:bg-error-container/40 transition-colors"
                        aria-label="Eliminar restaurante"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !showForm && (
              <div className="text-center py-12">
                <div className="inline-block mb-4">
                  <AztecStamp color="#C4501A" size={100}>
                    <span className="text-4xl">🏪</span>
                  </AztecStamp>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                  Aún sin restaurantes
                </h3>
                <p className="text-on-surface-variant text-sm mb-6 max-w-xs mx-auto">
                  Publica tu primer restaurante y empieza a recibir viajeros hambrientos
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-on-primary px-8 py-3 rounded-full font-bold shadow-md inline-flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Publicar mi restaurante
                </button>
              </div>
            )
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
