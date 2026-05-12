import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../api';
import type { Restaurant } from '../types';
import { CUISINE_EMOJI, CUISINE_LABELS } from '../types';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import AztecDivider from '../components/ui/AztecDivider';
import AztecStamp from '../components/ui/AztecStamp';
import { useAuth } from '../context/AuthContext';

const CUISINE_GRADIENTS: Record<string, string> = {
  mexican: 'from-orange-800 to-red-900',
  seafood: 'from-cyan-700 to-teal-800',
  italian: 'from-green-700 to-emerald-800',
  bbq: 'from-red-800 to-orange-900',
  steakhouse: 'from-red-900 to-stone-800',
  vegan: 'from-green-600 to-lime-700',
  vegetarian: 'from-green-500 to-teal-600',
  asian: 'from-red-700 to-orange-800',
  japanese: 'from-rose-700 to-pink-800',
  chinese: 'from-red-700 to-yellow-800',
  thai: 'from-orange-600 to-red-700',
  indian: 'from-orange-700 to-yellow-700',
  mediterranean: 'from-blue-700 to-teal-700',
  fast_food: 'from-yellow-600 to-orange-600',
  cafe: 'from-amber-800 to-yellow-900',
  bakery: 'from-amber-600 to-orange-700',
  tacos: 'from-orange-600 to-red-700',
  pizza: 'from-red-700 to-orange-700',
  burgers: 'from-yellow-700 to-red-700',
  bar: 'from-purple-800 to-indigo-800',
  fusion: 'from-violet-700 to-pink-700',
  local: 'from-stone-700 to-amber-800',
};

const PRICE_LABEL = ['', '$', '$$', '$$$', '$$$$'];

export default function Saved() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [saved, setSaved] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedIds: number[] = JSON.parse(localStorage.getItem('savedRestaurants') || '[]');
    if (savedIds.length === 0) { setLoading(false); return; }

    getRestaurants()
      .then(res => {
        const all: Restaurant[] = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        setSaved(all.filter(r => savedIds.includes(r.id)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeSaved = (id: number) => {
    const list: number[] = JSON.parse(localStorage.getItem('savedRestaurants') || '[]');
    localStorage.setItem('savedRestaurants', JSON.stringify(list.filter(x => x !== id)));
    setSaved(prev => prev.filter(r => r.id !== id));
  };

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
              Tu colección
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-headline text-3xl font-black text-[#FBF4E8] tracking-tight">
                Guardados
              </h2>
              <p className="text-[#C4A882] text-sm mt-1">
                {saved.length > 0
                  ? `${saved.length} ${saved.length === 1 ? 'lugar' : 'lugares'} en tu lista`
                  : 'Tus restaurantes favoritos vivirán aquí'}
              </p>
            </div>

            {saved.length > 0 && (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: 'rgba(212, 150, 10, 0.18)' }}
              >
                <span
                  className="material-symbols-outlined text-[#D4960A]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  favorite
                </span>
              </div>
            )}
          </div>
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

          {!isAuthenticated && (
            <div className="bg-white rounded-2xl p-6 text-center mb-6 border border-outline-variant/20 shadow-sm">
              <div className="inline-block mb-3">
                <AztecStamp color="#C4501A" size={70}>
                  <span className="text-3xl">🔐</span>
                </AztecStamp>
              </div>
              <p className="font-headline font-bold text-on-surface mb-1">Inicia sesión para guardar</p>
              <p className="text-sm text-on-surface-variant mb-4">
                Crea una cuenta para construir tu lista de sabores
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-on-primary px-6 py-2.5 rounded-full font-bold text-sm shadow-md"
                style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
              >
                Iniciar sesión
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-56 rounded-2xl bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : saved.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {saved.map(r => {
                const avgRating = r.reviews?.length
                  ? r.reviews.reduce((s, rev) => s + rev.rating, 0) / r.reviews.length
                  : r.avg_rating ?? 0;
                const gradient = CUISINE_GRADIENTS[r.cuisine_type] || 'from-stone-700 to-amber-800';
                const priceIdx = Math.min(Math.ceil((r.average_price || 1) / 150), 4);

                return (
                  <div
                    key={r.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(74,37,7,0.08)] border border-outline-variant/20 cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(196,80,26,0.18)] transition-all duration-300"
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                  >
                    <div className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
                      <AztecStamp color="#FBF4E8" size={84}>
                        <span className="text-3xl select-none">
                          {CUISINE_EMOJI[r.cuisine_type] || '🍽️'}
                        </span>
                      </AztecStamp>

                      <button
                        className="absolute top-2.5 right-2.5 w-9 h-9 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow active:scale-90 transition-transform"
                        onClick={e => { e.stopPropagation(); removeSaved(r.id); }}
                        aria-label="Quitar de guardados"
                      >
                        <span
                          className="material-symbols-outlined text-error text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </span>
                      </button>

                      {r.sponsorship && (
                        <div
                          className="absolute bottom-3 left-3 text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-tighter shadow text-on-primary"
                          style={{
                            background: r.sponsorship.visibility_level === 'premium' ? '#D4960A' : '#1B7A6E',
                          }}
                        >
                          {r.sponsorship.label}
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 right-0">
                        <AztecDivider color="#FBF4E8" inverted={true} />
                      </div>
                    </div>

                    <div className="p-3.5">
                      <h4 className="font-headline font-bold text-on-surface leading-tight truncate">
                        {r.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-1 h-1 rounded-full bg-secondary" />
                        <p className="text-[10px] text-secondary font-bold font-label uppercase tracking-widest">
                          {CUISINE_LABELS[r.cuisine_type]}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-outline-variant/15">
                        {avgRating > 0 ? (
                          <div
                            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(245, 200, 66, 0.22)' }}
                          >
                            <span
                              className="material-symbols-outlined text-tertiary text-[14px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span className="text-xs font-black text-on-surface">{avgRating.toFixed(1)}</span>
                          </div>
                        ) : <span />}
                        {priceIdx > 0 && (
                          <span className="text-sm font-black text-primary">{PRICE_LABEL[priceIdx]}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            isAuthenticated && (
              <div className="text-center py-16">
                <div className="inline-block mb-4">
                  <AztecStamp color="#C4501A" size={100}>
                    <span className="text-4xl">❤️</span>
                  </AztecStamp>
                </div>
                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                  Aún sin guardados
                </h3>
                <p className="text-on-surface-variant text-sm max-w-xs mx-auto mb-6">
                  Explora restaurantes y guarda tus favoritos para encontrarlos fácilmente
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 rounded-full font-bold shadow-md text-on-primary inline-flex items-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
                >
                  Explorar restaurantes
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
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
