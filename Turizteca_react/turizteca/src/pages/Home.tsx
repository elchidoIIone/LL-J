import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/ui/RestaurantCard';
import TrendingCard from '../components/ui/TrendingCard';
import AztecDivider from '../components/ui/AztecDivider';
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

  const filtered = useMemo(() => restaurants.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) ||
      CUISINE_LABELS[r.cuisine_type]?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || r.cuisine_type === activeCategory;
    return matchSearch && matchCat;
  }), [restaurants, search, activeCategory]);

  const featured = filtered.filter(r => r.sponsorship?.visibility_level === 'premium');
  const recommended = [...featured, ...filtered.filter(r => !featured.includes(r))].slice(0, 10);
  const trending = [...filtered].sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0)).slice(0, 8);

  // Stats reales del catálogo cargado
  const totalRestaurants = restaurants.length;
  const uniqueCuisines = useMemo(
    () => new Set(restaurants.map(r => r.cuisine_type)).size,
    [restaurants],
  );
  const premiumCount = restaurants.filter(r => r.sponsorship?.visibility_level === 'premium').length;

  return (
    <div className="pt-20 pb-4">

      {/* Hero — obsidiana con estadísticas */}
      <div
        className="px-6 pt-6 pb-10"
        style={{ background: 'linear-gradient(180deg, #1A0800 0%, #2A1200 100%)' }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-6 h-px bg-[#C4501A]" />
          <span className="font-label text-[#E8723C] uppercase tracking-widest text-[10px] font-bold">
            {user?.account_type === 'owner' ? 'Panel de propietario' : 'Bienvenido, viajero'}
          </span>
        </div>

        <h2 className="font-headline text-3xl font-black text-[#FBF4E8] tracking-tight mb-2 leading-tight">
          {user ? (
            <>¡Hola, <span style={{ color: '#E8723C' }}>{user.name.split(' ')[0]}</span>!</>
          ) : (
            '¿Qué vas a descubrir hoy?'
          )}
        </h2>

        <p className="text-[#C4A882] text-sm max-w-xs">
          Los sabores que México esconde, en la palma de tu mano.
        </p>

        {/* Estadísticas en vivo */}
        {!loading && totalRestaurants > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-[#FBF4E8] font-headline font-black text-2xl leading-none">
                {totalRestaurants}
              </p>
              <p className="text-[#C4A882] text-[10px] uppercase tracking-widest font-bold mt-1">
                Sabores
              </p>
            </div>
            <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
              <p className="text-[#FBF4E8] font-headline font-black text-2xl leading-none">
                {uniqueCuisines}
              </p>
              <p className="text-[#C4A882] text-[10px] uppercase tracking-widest font-bold mt-1">
                Cocinas
              </p>
            </div>
            <div className="p-3 rounded-2xl border border-white/10 bg-white/5">
              <p className="font-headline font-black text-2xl leading-none" style={{ color: '#D4960A' }}>
                {premiumCount}
              </p>
              <p className="text-[#C4A882] text-[10px] uppercase tracking-widest font-bold mt-1">
                Premium
              </p>
            </div>
          </div>
        )}

        {/* Búsqueda */}
        <div className="mt-5 flex items-center bg-white/10 border border-white/15 rounded-2xl px-4 py-3.5 backdrop-blur-sm">
          <span className="material-symbols-outlined text-[#C4A882] mr-3 text-sm">search</span>
          <input
            className="bg-transparent border-none outline-none w-full text-[#FBF4E8] placeholder-[#C4A882]/60 font-medium text-sm"
            placeholder="Busca restaurantes o cocinas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-[#C4A882] ml-2">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Divisor azteca de transición */}
      <div style={{ background: '#2A1200' }}>
        <AztecDivider color="#FBF4E8" />
      </div>

      {/* Curva de transición */}
      <div
        style={{
          height: '24px',
          background: '#FBF4E8',
          borderRadius: '28px 28px 0 0',
          marginTop: '-2px',
        }}
      />

      <div className="px-6 space-y-10">

        {/* Categorías */}
        <section className="-mt-2">
          <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex-none flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    active
                      ? 'text-on-primary border-transparent shadow-[0_4px_12px_rgba(196,80,26,0.35)]'
                      : 'bg-white text-on-surface-variant border-outline-variant/25 hover:border-primary/40'
                  }`}
                  style={active ? { background: 'linear-gradient(135deg, #C4501A, #E8723C)' } : {}}
                >
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span className="font-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Recomendados */}
        <section className="space-y-5">
          <div className="flex justify-between items-end">
            <div>
              <span className="font-label text-tertiary uppercase tracking-widest text-[10px] font-bold block mb-0.5">
                Cerca de ti
              </span>
              <h3 className="font-headline text-2xl font-bold text-on-surface">Recomendados</h3>
            </div>
            <button
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
              onClick={() => navigate('/explore')}
            >
              Ver todo
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          {loading ? (
            <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-4 -mx-6 px-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex-none w-72 h-96 rounded-3xl bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : recommended.length > 0 ? (
            <div className="flex overflow-x-auto gap-5 hide-scrollbar pb-4 -mx-6 px-6">
              {recommended.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          ) : (
            <div className="text-center py-14 bg-white rounded-3xl border border-outline-variant/20">
              <span className="text-5xl mb-3 block">🗺️</span>
              <p className="font-headline font-bold text-on-surface">Aún sin descubrimientos</p>
              <p className="text-sm mt-1 text-on-surface-variant">
                Prueba con otra búsqueda o categoría
              </p>
            </div>
          )}
        </section>

        {/* Trending */}
        {trending.length > 0 && (
          <section className="space-y-5 pb-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-label text-secondary uppercase tracking-widest text-[10px] font-bold block mb-0.5">
                  Lo más buscado
                </span>
                <h3 className="font-headline text-2xl font-bold text-on-surface">Trending</h3>
              </div>
              {/* Mini divisor azteca decorativo */}
              <div className="w-16 opacity-30 mb-1">
                <AztecDivider color="#1B7A6E" />
              </div>
            </div>

            <div className="space-y-3">
              {trending.map((r, i) => (
                <TrendingCard key={r.id} restaurant={r} rank={i + 1} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FAB Mapa */}
      <button
        onClick={() => navigate('/explore')}
        className="fixed bottom-28 right-5 w-14 h-14 text-on-primary rounded-full shadow-[0_8px_28px_rgba(196,80,26,0.45)] flex items-center justify-center active:scale-95 transition-transform z-40"
        style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
        aria-label="Abrir mapa"
      >
        <span className="material-symbols-outlined text-2xl">map</span>
      </button>
    </div>
  );
}
