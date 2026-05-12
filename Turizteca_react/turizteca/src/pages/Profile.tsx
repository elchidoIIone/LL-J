import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReviews, getRestaurants } from '../api';
import type { Review, Restaurant, Badge } from '../types';
import BottomNav from '../components/layout/BottomNav';
import Header from '../components/layout/Header';
import AztecDivider from '../components/ui/AztecDivider';
import AztecStamp from '../components/ui/AztecStamp';

/* ── Motor de gamificación ────────────────────────── */
const LEVELS = [
  { name: 'Viajero Novato', min: 0, color: '#9B7048' },
  { name: 'Explorador', min: 50, color: '#1B7A6E' },
  { name: 'Guía Local', min: 200, color: '#A67800' },
  { name: 'Catador', min: 500, color: '#C4501A' },
  { name: 'Leyenda Culinaria', min: 1000, color: '#D4960A' },
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
  }, [isAuthenticated, user?.id, navigate]);

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
    <div className="min-h-screen pb-32">
      <Header />

      <div className="pt-16">
        {/* Hero oscuro — avatar con sello azteca, nivel, XP */}
        <div
          className="px-6 pt-8 pb-8"
          style={{ background: 'linear-gradient(180deg, #1A0800 0%, #2A1200 100%)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="w-6 h-px bg-[#C4501A]" />
            <span className="font-label text-[#E8723C] uppercase tracking-widest text-[10px] font-bold">
              Tu perfil
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative">
              <AztecStamp color="#E8723C" size={130}>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
                >
                  <span className="font-headline text-3xl font-black text-[#FBF4E8] select-none">
                    {user?.name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              </AztecStamp>

              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-lg whitespace-nowrap"
                style={{ background: '#D4960A', color: '#1A0800' }}
              >
                NIVEL {level.index + 1}
              </div>
            </div>

            <h2 className="font-headline text-2xl font-black text-[#FBF4E8] mt-6 text-center">
              {user?.name}
            </h2>
            <span
              className="font-label text-sm font-bold uppercase tracking-widest mt-1"
              style={{ color: level.color === '#9B7048' ? '#C4A882' : level.color }}
            >
              {level.name}
            </span>
            <p className="text-[#C4A882] text-xs mt-1">{user?.email}</p>

            {/* Barra XP */}
            <div className="w-full max-w-xs mt-5">
              <div className="flex justify-between text-[10px] font-label font-bold text-[#C4A882] mb-1.5">
                <span>{xp} XP</span>
                {level.index < LEVELS.length - 1 && (
                  <span>{nextLevel.min} · {nextLevel.name}</span>
                )}
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(progress, 100)}%`,
                    background: 'linear-gradient(90deg, #C4501A, #E8723C)',
                  }}
                />
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => navigate(user?.account_type === 'owner' ? '/owner/dashboard' : '/')}
                className="bg-white/10 text-[#FBF4E8] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border border-white/15 hover:bg-white/15 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {user?.account_type === 'owner' ? 'store' : 'tune'}
                </span>
                {user?.account_type === 'owner' ? 'Mi restaurante' : 'Preferencias'}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-colors"
                style={{
                  background: 'rgba(251, 81, 81, 0.1)',
                  color: '#FB5151',
                  borderColor: 'rgba(251, 81, 81, 0.25)',
                }}
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Divisor azteca + curva */}
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

        {/* Contenido claro */}
        <div className="px-6 max-w-2xl mx-auto space-y-8 pb-4 -mt-2">

          {/* Stats */}
          <section className="grid grid-cols-4 gap-2">
            {[
              { value: reviews.length, label: 'Reseñas', color: '#C4501A' },
              { value: earnedBadges.length, label: 'Badges', color: '#1B7A6E' },
              { value: savedCount, label: 'Guardados', color: '#D4960A' },
              { value: uniqueCuisines.length, label: 'Cocinas', color: '#A8421A' },
            ].map(stat => (
              <div
                key={stat.label}
                className="bg-white p-3 rounded-2xl text-center shadow-sm border border-outline-variant/20"
              >
                <span className="font-headline font-black text-2xl block leading-none" style={{ color: stat.color }}>
                  {stat.value}
                </span>
                <p className="text-[10px] font-label font-bold uppercase text-on-surface-variant mt-1.5 tracking-tighter">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          {/* Badges */}
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="font-label text-tertiary uppercase tracking-widest text-[10px] font-bold block mb-0.5">
                  Tus logros
                </span>
                <h3 className="font-headline text-xl font-bold text-on-surface">Mis Badges</h3>
              </div>
              <span className="text-sm font-label text-on-surface-variant">
                <span className="text-primary font-black">{earnedBadges.length}</span>
                <span className="text-on-surface-variant/60">/{badges.length}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl text-center transition-all border ${
                    badge.earned
                      ? 'bg-white shadow-sm border-tertiary/30'
                      : 'bg-surface-container/40 border-outline-variant/10 opacity-50 grayscale'
                  }`}
                >
                  <span className="text-3xl block mb-2">{badge.icon}</span>
                  <p className="text-xs font-bold text-on-surface font-label leading-tight">{badge.name}</p>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">{badge.description}</p>
                  {badge.earned && (
                    <span className="mt-2 inline-block text-[9px] font-bold uppercase tracking-widest text-secondary">
                      ✓ Obtenido
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Mapa de Sabores */}
          <section className="space-y-4">
            <div>
              <span className="font-label text-secondary uppercase tracking-widest text-[10px] font-bold block mb-0.5">
                Tu expedición
              </span>
              <h3 className="font-headline text-xl font-bold text-on-surface">Mapa de Sabores</h3>
            </div>

            {reviews.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {[...new Set(reviews.map(r => r.restaurant_id))].slice(0, 20).map((rid, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-outline-variant/20 shadow-sm"
                  >
                    <span className="text-lg">🍽️</span>
                    <span className="text-xs font-bold text-on-surface font-label">#{rid}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-outline-variant/20">
                <span className="text-5xl block mb-3">🗺️</span>
                <p className="font-headline font-bold text-on-surface">Tu expedición inicia aquí</p>
                <p className="text-sm text-on-surface-variant mt-1 mb-4">
                  Aún no has dejado tu marca en ningún restaurante
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="text-primary font-bold text-sm hover:underline inline-flex items-center gap-1"
                >
                  Descubrir restaurantes
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            )}
          </section>

          {/* Reseñas recientes */}
          {reviews.length > 0 && (
            <section className="space-y-4">
              <div>
                <span
                  className="font-label uppercase tracking-widest text-[10px] font-bold block mb-0.5"
                  style={{ color: '#D4960A' }}
                >
                  Tu palabra cuenta
                </span>
                <h3 className="font-headline text-xl font-bold text-on-surface">Reseñas recientes</h3>
              </div>
              <div className="space-y-3">
                {reviews.slice(0, 5).map(rev => (
                  <div
                    key={rev.id}
                    className="bg-white rounded-2xl p-4 border border-outline-variant/20 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <span
                            key={s}
                            className="material-symbols-outlined text-sm text-tertiary"
                            style={{ fontVariationSettings: `'FILL' ${s <= rev.rating ? 1 : 0}` }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-on-surface-variant font-label">
                        {new Date(rev.created_at).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    {rev.comment && (
                      <p className="text-sm text-on-surface-variant leading-relaxed">{rev.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
