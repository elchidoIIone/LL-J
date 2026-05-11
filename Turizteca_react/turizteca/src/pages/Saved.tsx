import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../api';
import type { Restaurant } from '../types';
import { CUISINE_EMOJI, CUISINE_LABELS } from '../types';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import StarRating from '../components/ui/StarRating';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-background pb-32">
      <Header />

      <div className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="space-y-2 mb-8">
          <span className="font-label text-tertiary uppercase tracking-widest text-xs font-bold">Tu lista</span>
          <h2 className="font-headline text-3xl font-black text-on-surface">Guardados</h2>
          <p className="text-on-surface-variant text-sm">Tus restaurantes favoritos, siempre a la mano.</p>
        </div>

        {!isAuthenticated && (
          <div className="bg-surface-container-low rounded-2xl p-6 text-center mb-6">
            <span className="text-4xl block mb-3">🔐</span>
            <p className="font-headline font-bold text-on-surface mb-1">Inicia sesión para guardar</p>
            <p className="text-sm text-on-surface-variant mb-4">Crea una cuenta para guardar tus favoritos</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold text-sm"
            >
              Iniciar sesión
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-surface-container animate-pulse" />
            ))}
          </div>
        ) : saved.length > 0 ? (
          <>
            <p className="text-sm text-on-surface-variant font-label mb-4">{saved.length} lugares guardados</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {saved.map(r => {
                const avgRating = r.reviews?.length
                  ? r.reviews.reduce((s, rev) => s + rev.rating, 0) / r.reviews.length
                  : r.avg_rating ?? 0;
                return (
                  <div
                    key={r.id}
                    className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(74,37,7,0.06)] border border-outline-variant/10 cursor-pointer hover:-translate-y-0.5 transition-transform"
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                  >
                    <div className="h-40 relative bg-gradient-to-br from-surface-container to-surface-dim flex items-center justify-center">
                      <span className="text-6xl opacity-70">{CUISINE_EMOJI[r.cuisine_type] || '🍽️'}</span>
                      <button
                        className="absolute top-3 right-3 w-8 h-8 bg-surface-container-lowest/80 backdrop-blur-md rounded-full flex items-center justify-center shadow"
                        onClick={e => { e.stopPropagation(); removeSaved(r.id); }}
                      >
                        <span className="material-symbols-outlined text-error text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      </button>
                      {r.sponsorship && (
                        <div className="absolute bottom-3 left-3 bg-primary-dim/90 text-white text-[9px] px-2.5 py-1 rounded-full font-bold uppercase">
                          {r.sponsorship.label}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h4 className="font-headline font-bold text-on-surface leading-tight">{r.name}</h4>
                      <p className="text-xs text-on-surface-variant font-label mt-0.5">{CUISINE_LABELS[r.cuisine_type]}</p>

                      <div className="flex items-center justify-between mt-3">
                        {avgRating > 0 ? (
                          <div className="flex items-center gap-1">
                            <StarRating rating={avgRating} />
                            <span className="text-xs font-bold text-on-surface ml-1">{avgRating.toFixed(1)}</span>
                          </div>
                        ) : <span />}
                        <span className="text-sm font-bold text-primary">${r.average_price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">❤️</span>
            <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Nada guardado aún</h3>
            <p className="text-on-surface-variant text-sm max-w-xs mx-auto mb-6">
              Explora restaurantes y guarda tus favoritos para encontrarlos fácilmente
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold shadow-md"
            >
              Explorar restaurantes
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
