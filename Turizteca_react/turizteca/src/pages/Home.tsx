import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/ui/RestaurantCard';
import TrendingCard from '../components/ui/TrendingCard';
import { getRestaurants } from '../api';
import type { Restaurant, CuisineType } from '../types';
import { CUISINE_LABELS } from '../types';
import { useAuth } from '../context/AuthContext';

const CATEGORIES: { key: CuisineType | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'Todos', emoji: '🍽️' },
  { key: 'mexican', label: 'Mexicana', emoji: '🌮' },
  { key: 'seafood', label: 'Mariscos', emoji: '🦞' },
  { key: 'tacos', label: 'Tacos', emoji: '🌮' },
  { key: 'cafe', label: 'Café', emoji: '☕' },
  { key: 'italian', label: 'Italiana', emoji: '🍝' },
  { key: 'japanese', label: 'Japonesa', emoji: '🍣' },
  { key: 'vegan', label: 'Vegana', emoji: '🥗' },
  { key: 'bbq', label: 'BBQ', emoji: '🥩' },
];

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<CuisineType | 'all'>('all');

  useEffect(() => {
    getRestaurants()
      .then(res => setRestaurants(Array.isArray(res.data) ? res.data : res.data.data ?? []))
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = restaurants.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
      CUISINE_LABELS[r.cuisine_type]?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || r.cuisine_type === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered.filter(r => r.sponsorship?.visibility_level === 'premium');
  const recommended = [...featured, ...filtered.filter(r => !featured.includes(r))].slice(0, 10);
  const trending = [...filtered].sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)).slice(0, 8);

  return (
    <div className="pt-24 px-6 space-y-10 pb-4">
      {/* Welcome */}
      <section className="space-y-2">
        <span className="font-label text-tertiary uppercase tracking-widest text-xs font-bold">Bienvenido</span>
        <h2 className="font-headline text-4xl font-black text-on-surface tracking-tight">
          {user ? `¡Hola, ${user.name.split(' ')[0]}!` : '¡Hola, Viajero!'}
        </h2>
        <p className="text-on-surface-variant max-w-xs">
          Descubre los secretos culinarios más guardados de la región.
        </p>
      </section>

      {/* Search */}
      <section className="relative">
        <div className="flex items-center bg-surface-container-low rounded-full px-5 py-4 shadow-sm border border-outline-variant/15">
          <span className="material-symbols-outlined text-outline mr-3">search</span>
          <input
            className="bg-transparent border-none outline-none w-full text-on-surface placeholder-on-surface-variant/60 font-medium"
            placeholder="Busca ciudades o cocinas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-outline ml-2">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-none flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.key
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="font-label">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recommended */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="font-label text-tertiary uppercase tracking-widest text-[10px] font-bold">Cerca de ti</span>
            <h3 className="font-headline text-2xl font-bold text-on-surface">Recomendados</h3>
          </div>
          <button className="text-primary font-bold text-sm hover:underline" onClick={() => navigate('/explore')}>
            Ver todo
          </button>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-none w-72 h-96 rounded-xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : recommended.length > 0 ? (
          <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-4 -mx-6 px-6">
            {recommended.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="text-5xl mb-4 block">🍽️</span>
            <p className="font-label font-medium">No se encontraron restaurantes</p>
            <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
          </div>
        )}
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="font-label text-tertiary uppercase tracking-widest text-[10px] font-bold">Lo más buscado</span>
            <h3 className="font-headline text-2xl font-bold text-on-surface">Trending Restaurants</h3>
          </div>
          <div className="space-y-4">
            {trending.map(r => <TrendingCard key={r.id} restaurant={r} />)}
          </div>
        </section>
      )}

      {/* FAB Map */}
      <button
        onClick={() => navigate('/explore')}
        className="fixed bottom-28 right-6 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-40"
      >
        <span className="material-symbols-outlined text-2xl">map</span>
      </button>
    </div>
  );
}
