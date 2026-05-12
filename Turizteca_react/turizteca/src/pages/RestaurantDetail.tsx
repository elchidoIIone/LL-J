import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurant, getReviews, createReview } from '../api';
import type { Restaurant, Review, RatingValue } from '../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../types';
import StarRating from '../components/ui/StarRating';
import AztecStamp from '../components/ui/AztecStamp';
import AztecDivider from '../components/ui/AztecDivider';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/layout/BottomNav';

const PRICE_LABEL = ['', '$', '$$', '$$$', '$$$$'];

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState<RatingValue>(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const savedKey = 'savedRestaurants';

  useEffect(() => {
    if (!id) return;
    const savedList: number[] = JSON.parse(localStorage.getItem(savedKey) || '[]');
    setSaved(savedList.includes(Number(id)));

    Promise.all([
      getRestaurant(Number(id)),
      getReviews(Number(id)),
    ]).then(([rRes, revRes]) => {
      setRestaurant(rRes.data?.data ?? rRes.data);
      const revData = revRes.data?.data ?? revRes.data;
      setReviews(Array.isArray(revData) ? revData : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const toggleSave = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const list: number[] = JSON.parse(localStorage.getItem(savedKey) || '[]');
    const rid = Number(id);
    const next = saved ? list.filter(x => x !== rid) : [...list, rid];
    localStorage.setItem(savedKey, JSON.stringify(next));
    setSaved(!saved);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      const res = await createReview({ restaurant_id: Number(id), rating, comment });
      const newReview = res.data?.data ?? res.data;
      setReviews(prev => [{ ...newReview, user }, ...prev]);
      setComment('');
      setRating(5);
      setShowReviewForm(false);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setReviewError(msg || 'Error al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-on-surface-variant font-label font-medium">Cargando restaurante...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <span className="text-6xl">😕</span>
          <p className="text-on-surface font-headline text-xl mt-4">Restaurante no encontrado</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary font-bold hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const emoji = CUISINE_EMOJI[restaurant.cuisine_type] || '🍽️';
  const priceIdx = Math.min(Math.ceil((restaurant.average_price || 1) / 150), 4);
  const sponsorTier = restaurant.sponsorship?.visibility_level;
  const sponsorBadge = sponsorTier === 'premium'
    ? 'Local Legend' : sponsorTier === 'featured'
    ? 'Destacado' : sponsorTier === 'basic'
    ? 'Patrocinado' : null;
  const sponsorColor = sponsorTier === 'premium' ? '#D4960A' : sponsorTier === 'featured' ? '#1B7A6E' : '#C4501A';

  return (
    <div className="min-h-screen pb-32 bg-background">

      {/* Hero oscuro con sello azteca grande */}
      <div
        className="relative h-80 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A0800 0%, #2A1200 60%, #3D1A00 100%)' }}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 px-5 pt-12 pb-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#FBF4E8] active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
          </button>

          <button
            onClick={toggleSave}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center active:scale-90 transition-transform"
            aria-label={saved ? 'Quitar de guardados' : 'Guardar'}
          >
            <span
              className="material-symbols-outlined text-sm"
              style={{
                color: saved ? '#FB5151' : '#FBF4E8',
                fontVariationSettings: saved ? "'FILL' 1" : undefined,
              }}
            >
              favorite
            </span>
          </button>
        </div>

        {/* Sello azteca con emoji */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AztecStamp color="#E8723C" size={190}>
            <span className="text-7xl drop-shadow-2xl select-none">{emoji}</span>
          </AztecStamp>
        </div>

        {/* Badge de patrocinio */}
        {sponsorBadge && (
          <div
            className="absolute bottom-8 left-5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-lg text-on-primary"
            style={{ background: sponsorColor }}
          >
            ◆ {sponsorBadge}
          </div>
        )}

        {/* Divisor azteca al pie */}
        <div className="absolute bottom-0 left-0 right-0">
          <AztecDivider color="#FBF4E8" inverted={true} />
        </div>
      </div>

      {/* Curva de transición */}
      <div
        style={{
          height: '24px',
          background: '#FBF4E8',
          borderRadius: '28px 28px 0 0',
          marginTop: '-2px',
          position: 'relative',
        }}
      />

      {/* Info en pergamino */}
      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto -mt-2">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1 h-1 rounded-full bg-secondary" />
              <span className="font-label text-secondary uppercase tracking-widest text-[10px] font-bold">
                {CUISINE_LABELS[restaurant.cuisine_type]}
              </span>
            </div>
            <h1 className="font-headline text-3xl font-black text-on-surface tracking-tight leading-tight">
              {restaurant.name}
            </h1>
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={avgRating} size="md" />
                <span className="text-sm font-black text-on-surface">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-on-surface-variant">
                  ({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})
                </span>
              </div>
            )}
          </div>

          <div
            className="text-right shrink-0 px-4 py-2.5 rounded-2xl"
            style={{ background: 'rgba(196, 80, 26, 0.08)' }}
          >
            <p className="text-2xl font-black font-headline text-primary leading-none">
              ${restaurant.average_price}
            </p>
            <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest mt-1">
              {priceIdx > 0 && PRICE_LABEL[priceIdx]} · MXN
            </p>
          </div>
        </div>

        {restaurant.description && (
          <p className="text-on-surface-variant leading-relaxed">{restaurant.description}</p>
        )}

        {/* Chips de detalles */}
        <div className="flex flex-wrap gap-2">
          {restaurant.opens_at && restaurant.closes_at && (
            <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl text-sm text-on-surface border border-outline-variant/20 shadow-sm">
              <span className="material-symbols-outlined text-sm text-primary">schedule</span>
              <span className="font-medium">{restaurant.opens_at} – {restaurant.closes_at}</span>
            </div>
          )}
          {restaurant.location_lat && restaurant.location_lng && (
            <button
              onClick={() => navigate(`/explore?lat=${restaurant.location_lat}&lng=${restaurant.location_lng}&rid=${restaurant.id}`)}
              className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl text-sm text-on-surface border border-outline-variant/20 shadow-sm hover:border-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
              <span className="font-medium">Ver en mapa</span>
            </button>
          )}
        </div>

        {/* Botón promocionar para el dueño */}
        {user?.id === restaurant.owner_id && !restaurant.sponsorship && (
          <button
            onClick={() => navigate(`/sponsorship/${restaurant.id}`)}
            className="w-full text-on-primary py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            Promocionar mi restaurante
          </button>
        )}

        {/* Sección de reseñas */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <span
                className="font-label uppercase tracking-widest text-[10px] font-bold block mb-0.5"
                style={{ color: '#D4960A' }}
              >
                La voz de los viajeros
              </span>
              <h2 className="font-headline text-xl font-bold text-on-surface">Reseñas</h2>
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(f => !f)}
                className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-sm">
                  {showReviewForm ? 'close' : 'edit'}
                </span>
                {showReviewForm ? 'Cancelar' : 'Escribir'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="bg-white rounded-2xl p-5 space-y-4 border border-primary/20 shadow-md">
              <h3 className="font-headline font-bold text-on-surface">Tu reseña</h3>
              <div>
                <p className="text-xs text-on-surface-variant mb-2 font-label uppercase tracking-widest font-bold">
                  Calificación
                </p>
                <div className="flex gap-1">
                  {([1, 2, 3, 4, 5] as RatingValue[]).map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 active:scale-95"
                    >
                      <span
                        className="material-symbols-outlined text-tertiary text-3xl"
                        style={{ fontVariationSettings: `'FILL' ${star <= rating ? 1 : 0}` }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <textarea
                  className="w-full bg-surface-container-low rounded-xl p-3 text-on-surface placeholder-on-surface-variant/50 border border-outline-variant/20 outline-none focus:border-primary resize-none font-body text-sm"
                  rows={3}
                  placeholder="¿Qué te pareció? (opcional)"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>
              {reviewError && (
                <p className="text-error text-sm font-label flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {reviewError}
                </p>
              )}
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full text-on-primary py-3 rounded-xl font-bold disabled:opacity-50 active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #C4501A, #E8723C)' }}
              >
                {submitting ? 'Enviando...' : 'Publicar reseña'}
              </button>
            </div>
          )}

          {reviews.length > 0 ? reviews.map(rev => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-4 space-y-2 border border-outline-variant/20 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-on-surface text-sm">{rev.user?.name || 'Anónimo'}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <span
                        key={s}
                        className="material-symbols-outlined text-[14px] text-tertiary"
                        style={{ fontVariationSettings: `'FILL' ${s <= rev.rating ? 1 : 0}` }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant font-label">
                  {new Date(rev.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              {rev.comment && (
                <p className="text-on-surface-variant text-sm leading-relaxed">{rev.comment}</p>
              )}
            </div>
          )) : (
            <div className="text-center py-10 bg-white rounded-2xl border border-outline-variant/20">
              <span className="text-4xl block mb-2">💬</span>
              <p className="font-headline font-bold text-on-surface">Aún sin reseñas</p>
              <p className="text-sm text-on-surface-variant mt-1">Sé el primero en dejar tu marca</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
