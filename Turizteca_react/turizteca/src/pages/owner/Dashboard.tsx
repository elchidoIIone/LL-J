import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants, createRestaurant, deleteRestaurant } from '../../api';
import type { Restaurant, RestaurantFormData, CuisineType } from '../../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../../types';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import { useAuth } from '../../context/AuthContext';

const CUISINES = Object.entries(CUISINE_LABELS) as [CuisineType, string][];

const EMPTY_FORM: RestaurantFormData = {
  name: '',
  description: '',
  cuisine_type: 'mexican',
  average_price: 150,
  location_lat: 19.4326,
  location_lng: -99.1332,
  opening_hours_type: 'fixed',
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

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.account_type !== 'owner' && user?.account_type !== 'admin') {
      navigate('/');
      return;
    }
    fetchMyRestaurants();
  }, [isAuthenticated, user]);

  const fetchMyRestaurants = () => {
    getRestaurants()
      .then(res => {
        const all: Restaurant[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        setRestaurants(all.filter(r => r.owner_id === user?.id));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await createRestaurant(form);
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

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="font-label text-tertiary uppercase tracking-widest text-xs font-bold">Panel de propietario</span>
            <h2 className="font-headline text-3xl font-black text-on-surface mt-1">Mis Restaurantes</h2>
          </div>
          <button
            onClick={() => { setShowForm(f => !f); setFormError(''); }}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-bold text-sm shadow-md"
          >
            <span className="material-symbols-outlined text-sm">{showForm ? 'close' : 'add'}</span>
            {showForm ? 'Cancelar' : 'Nuevo'}
          </button>
        </div>

        {success && (
          <div className="bg-tertiary-container/30 border border-tertiary/20 rounded-xl p-3 flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <p className="text-tertiary font-label font-bold text-sm">{success}</p>
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <form onSubmit={handleCreate} className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 shadow-sm mb-8 space-y-4">
            <h3 className="font-headline text-lg font-bold text-on-surface">Publicar nuevo restaurante</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Nombre del restaurante *</label>
                <input
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm"
                  placeholder="Ej: La Cocina de María"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Descripción</label>
                <textarea
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm resize-none"
                  rows={2}
                  placeholder="Describe tu restaurante..."
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Tipo de cocina *</label>
                <select
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm"
                  value={form.cuisine_type}
                  onChange={e => update('cuisine_type', e.target.value as CuisineType)}
                  required
                >
                  {CUISINES.map(([val, label]) => (
                    <option key={val} value={val}>{CUISINE_EMOJI[val]} {label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Precio promedio (MXN) *</label>
                <input
                  type="number"
                  min={10}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm"
                  value={form.average_price}
                  onChange={e => update('average_price', Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Abre a las</label>
                <input
                  type="time"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm"
                  value={form.opens_at}
                  onChange={e => update('opens_at', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Cierra a las</label>
                <input
                  type="time"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm"
                  value={form.closes_at}
                  onChange={e => update('closes_at', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Latitud (ubicación)</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm"
                  value={form.location_lat}
                  onChange={e => update('location_lat', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface-variant font-label mb-1 block">Longitud (ubicación)</label>
                <input
                  type="number"
                  step="any"
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none border border-outline-variant/20 focus:border-primary text-sm"
                  value={form.location_lng}
                  onChange={e => update('location_lng', Number(e.target.value))}
                />
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
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-3.5 rounded-xl font-bold shadow-md disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  Publicando...
                </span>
              ) : '🚀 Publicar restaurante'}
            </button>
          </form>
        )}

        {/* My restaurants list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 rounded-2xl bg-surface-container animate-pulse" />)}
          </div>
        ) : restaurants.length > 0 ? (
          <div className="space-y-4">
            {restaurants.map(r => (
              <div
                key={r.id}
                className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/10 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-3xl flex-shrink-0">
                    {CUISINE_EMOJI[r.cuisine_type] || '🍽️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-headline font-bold text-on-surface leading-tight">{r.name}</h4>
                    <p className="text-xs text-on-surface-variant font-label">{CUISINE_LABELS[r.cuisine_type]} · ${r.average_price} MXN</p>
                    {r.sponsorship ? (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        {r.sponsorship.label}
                      </span>
                    ) : (
                      <button
                        onClick={() => navigate(`/sponsorship/${r.id}`)}
                        className="mt-1 text-[10px] font-bold text-tertiary flex items-center gap-0.5 hover:underline"
                      >
                        <span className="material-symbols-outlined text-[10px]">rocket_launch</span>
                        Promocionar
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/restaurant/${r.id}`)}
                      className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.name)}
                      className="w-9 h-9 rounded-full bg-error-container/20 flex items-center justify-center text-error hover:bg-error-container/40"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !showForm && (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">🏪</span>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Aún no tienes restaurantes</h3>
            <p className="text-on-surface-variant text-sm mb-6">Publica tu primer restaurante y empieza a recibir visitantes</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-md"
            >
              + Publicar mi restaurante
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
