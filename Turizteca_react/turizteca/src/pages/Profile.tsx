import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviews, getRestaurants } from '../api';
import type { Review, Restaurant, Badge } from '../types';
import BottomNav from '../components/layout/BottomNav';
import Header from '../components/layout/Header';

/* ── Gamification engine ─────────────────────────── */
const LEVELS = [
  { name: 'Viajero Novato', min: 0, color: 'text-on-surface-variant', bg: 'bg-surface-container' },
  { name: 'Explorador', min: 50, color: 'text-tertiary', bg: 'bg-tertiary-container/40' },
  { name: 'Guía Local', min: 200, color: 'text-secondary', bg: 'bg-secondary-container/40' },
  { name: 'Catador', min: 500, color: 'text-primary', bg: 'bg-primary-container/30' },
  { name: 'Leyenda Culinaria', min: 1000, color: 'text-primary-dim', bg: 'bg-primary-container/50' },
];

function getLevel(xp: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
}

function getXP(reviews: Review[], savedCount: number) {
  return reviews.length * 10 + savedCount * 2;
}

function computeBadges(reviews: Review[], savedCount: number): Badge[] {
  const rc = reviews.length;
  return [
    { id: 'first_review', name: 'Primera Reseña', icon: '✍️', description: 'Escribiste tu primera reseña', earned: rc >= 1 },
    { id: 'catador', name: 'Catador', icon: '🍷', description: 'Escribiste 5 reseñas', earned: rc >= 5 },
    { id: 'critico', name: 'Crítico Local', icon: '📝', description: 'Escribiste 20 reseñas', earned: rc >= 20 },
    { id: 'leyenda', name: 'Leyenda', icon: '🏆', description: 'Escribiste 50 reseñas', earned: rc >= 50 },
    { id: 'saved5', name: 'Coleccionista', icon: '❤️', description: 'Guardaste 5 restaurantes', earned: savedCount >= 5 },
    { id: 'saved10', name: 'Curador', icon: '📌', description: 'Guardaste 10 restaurantes', earned: savedCount >= 10 },
    { id: 'viajero', name: 'Gran Viajero', icon: '🗺️', description: 'Explora 3 tipos de cocina', earned: new Set(reviews.map(r => r.restaurant_id)).size >= 3 },
    { id: 'foodie', name: 'Foodie', icon: '🍽️', description: 'Reseña 10 restaurantes distintos', earned: new Set(reviews.map(r => r.restaurant_id)).size >= 10 },
  ];
}

/* ── Component ───────────────────────────────────── */
export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [savedRestaurants, setSavedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const savedIds: number[] = JSON.parse(localStorage.getItem('savedRestaurants') || '[]');

    Promise.all([
      getReviews().then(r => Array.isArray(r.data) ? r.data : r.data.data ?? []),
      getRestaurants().then(r => Array.isArray(r.data) ? r.data : r.data.data ?? []),
    ]).then(([allReviews, allRestaurants]) => {
      const myReviews = allReviews.filter((r: Review) => r.user_id === user?.id);
      setReviews(myReviews);
      const saved = allRestaurants.filter((r: Restaurant) => savedIds.includes(r.id));
      setSavedRestaurants(saved);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isAuthenticated, user?.id]);

  const savedCount = savedRestaurants.length;
  const xp = getXP(reviews, savedCount);
  const level = getLevel(xp);
  const nextLevel = LEVELS[Math.min(level.index + 1, LEVELS.length - 1)];
  const progress = level.index < LEVELS.length - 1
    ? ((xp - level.min) / (nextLevel.min - level.min)) * 100
    : 100;
  const badges = computeBadges(reviews, savedCount);
  const earnedBadges = badges.filter(b => b.earned);
  const uniqueCuisines = [...new Set(reviews.map(r => r.restaurant_id))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <div className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        {/* Profile header */}
        <section className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-lg">
              <span className="text-5xl">👤</span>
            </div>
            <div className={`absolute -bottom-1 -right-1 ${level.bg} ${level.color} px-2 py-0.5 rounded-full text-[10px] font-bold font-label border border-white`}>
              Nv.{level.index + 1}
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h2 className="font-headline text-2xl font-bold text-on-surface">{user?.name}</h2>
            <span className={`font-label text-sm font-bold uppercase tracking-widest ${level.color}`}>
              {level.name}
            </span>
            <p className="text-on-surface-variant text-sm mt-1">{user?.email}</p>

            {/* XP Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs font-label font-bold text-on-surface-variant mb-1">
                <span>{xp} XP</span>
                {level.index < LEVELS.length - 1 && <span>{nextLevel.min} XP → {nextLevel.name}</span>}
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4 justify-center sm:justify-start">
              <button
                onClick={() => navigate('/owner/dashboard')}
                className="bg-surface-container-low text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">settings</span>
                {user?.account_type === 'owner' ? 'Mi restaurante' : 'Configuración'}
              </button>
              <button
                onClick={logout}
                className="bg-error-container/20 text-error px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Salir
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: reviews.length, label: 'Reseñas', color: 'text-primary' },
            { value: earnedBadges.length, label: 'Badges', color: 'text-secondary' },
            { value: savedCount, label: 'Guardados', color: 'text-tertiary' },
            { value: uniqueCuisines.length, label: 'Cocinas', color: 'text-primary-dim' },
          ].map(stat => (
            <div key={stat.label} className="bg-surface-container-low p-5 rounded-2xl text-center shadow-sm">
              <span className={`text-3xl font-headline font-black ${stat.color}`}>{stat.value}</span>
              <p className="text-xs font-label font-bold uppercase text-on-surface-variant mt-1 tracking-tighter">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">emoji_events</span>
              Mis Badges
            </h3>
            <span className="text-sm font-label text-on-surface-variant">{earnedBadges.length}/{badges.length}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl text-center transition-all ${
                  badge.earned
                    ? 'bg-surface-container-lowest shadow-sm border border-outline-variant/10'
                    : 'bg-surface-container opacity-40 grayscale'
                }`}
              >
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <p className="text-xs font-bold text-on-surface font-label leading-tight">{badge.name}</p>
                <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">{badge.description}</p>
                {badge.earned && (
                  <span className="mt-2 inline-block text-[9px] font-bold text-tertiary uppercase tracking-widest">✓ Obtenido</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Mapa de Sabores (cuisine exploration) */}
        <section className="space-y-4">
          <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">travel_explore</span>
            Mapa de Sabores
          </h3>
          <p className="text-sm text-on-surface-variant">Tipos de cocina que has explorado</p>

          {reviews.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {[...new Set(reviews.map(r => r.restaurant_id))].slice(0, 20).map((rid, i) => {
                const rev = reviews.find(r => r.restaurant_id === rid);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-surface-container-lowest px-3 py-2 rounded-xl border border-outline-variant/10 shadow-sm"
                  >
                    <span className="text-lg">🍽️</span>
                    <span className="text-xs font-bold text-on-surface font-label">Restaurante #{rev?.restaurant_id}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-surface-container-low rounded-2xl">
              <span className="text-5xl block mb-3">🗺️</span>
              <p className="text-on-surface-variant font-label font-medium">Aún no has explorado ningún restaurante</p>
              <button onClick={() => navigate('/')} className="mt-3 text-primary font-bold text-sm">
                Descubrir restaurantes →
              </button>
            </div>
          )}
        </section>

        {/* Recent reviews */}
        {reviews.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">rate_review</span>
              Mis Reseñas Recientes
            </h3>
            <div className="space-y-3">
              {reviews.slice(0, 5).map(rev => (
                <div key={rev.id} className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className="material-symbols-outlined text-xs text-secondary-fixed-dim" style={{ fontVariationSettings: `'FILL' ${s <= rev.rating ? 1 : 0}` }}>star</span>
                      ))}
                    </div>
                    <span className="text-xs text-on-surface-variant font-label">
                      {new Date(rev.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  {rev.comment && <p className="text-sm text-on-surface-variant">{rev.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
