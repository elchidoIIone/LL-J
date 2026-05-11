import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRestaurant, getReviews, createReview } from '../api';
import type { Restaurant, Review, RatingValue } from '../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../types';
import StarRating from '../components/ui/StarRating';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/layout/BottomNav';

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
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
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
          <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold">← Volver al inicio</button>
        </div>
      </div>
    );
  }

  const emoji = CUISINE_EMOJI[restaurant.cuisine_type] || '🍽️';
  const sponsorBadge = restaurant.sponsorship?.visibility_level === 'premium'
    ? 'Local Legend' : restaurant.sponsorship?.visibility_level === 'featured'
    ? 'Destacado' : restaurant.sponsorship?.visibility_level === 'basic'
    ? 'Patrocinado' : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-72 bg-gradient-to-br from-primary to-primary-container flex items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-5 w-10 h-10 bg-surface-container-lowest/80 backdrop-blur-md rounded-full flex items-center justify-center text-on-surface shadow"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
        </button>

        <button
          onClick={toggleSave}
          className="absolute top-12 right-5 w-10 h-10 bg-surface-container-lowest/80 backdrop-blur-md rounded-full flex items-center justify-center shadow"
        >
          <span
            className={`material-symbols-outlined ${saved ? 'text-error' : 'text-on-surface'}`}
            style={saved ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            favorite
          </span>
        </button>

        <span className="text-9xl opacity-40 select-none">{emoji}</span>

        {sponsorBadge && (
          <div className="absolute bottom-4 left-5 bg-primary-dim text-white text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-tighter">
            {sponsorBadge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-6 py-6 space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <span className="font-label text-tertiary uppercase tracking-widest text-xs font-bold">
              {CUISINE_LABELS[restaurant.cuisine_type]}
            </span>
            <h1 className="font-headline text-3xl font-black text-on-surface tracking-tight mt-1">{restaurant.name}</h1>
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={avgRating} size="md" />
                <span className="text-sm font-bold text-on-surface">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-on-surface-variant">({reviews.length} reseñas)</span>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-black text-primary">${restaurant.average_price}</p>
            <p className="text-xs text-on-surface-variant font-label">precio promedio</p>
          </div>
        </div>

        {restaurant.description && (
          <p className="text-on-surface-variant leading-relaxed">{restaurant.description}</p>
        )}

        {/* Details chips */}
        <div className="flex flex-wrap gap-2">
          {restaurant.opens_at && restaurant.closes_at && (
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-2 rounded-xl text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-primary">schedule</span>
              {restaurant.opens_at} – {restaurant.closes_at}
            </div>
          )}
          {restaurant.location_lat && (
            <div className="flex items-center gap-1.5 bg-surface-container px-3 py-2 rounded-xl text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-sm text-primary">location_on</span>
              Ver en mapa
            </div>
          )}
        </div>

        {/* Owner promote button */}
        {user?.id === restaurant.owner_id && !restaurant.sponsorship && (
          <button
            onClick={() => navigate(`/sponsorship/${restaurant.id}`)}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            Promocionar mi restaurante
          </button>
        )}

        {/* Reviews section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-headline text-xl font-bold text-on-surface">Reseñas</h2>
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(f => !f)}
                className="text-primary font-bold text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                {showReviewForm ? 'Cancelar' : 'Escribir reseña'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="bg-surface-container-lowest rounded-2xl p-5 space-y-4 border border-outline-variant/20">
              <h3 className="font-headline font-bold text-on-surface">Tu reseña</h3>
              <div>
                <p className="text-sm text-on-surface-variant mb-2 font-label">Calificación</p>
                <div className="flex gap-1">
                  {([1, 2, 3, 4, 5] as RatingValue[]).map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      <span
                        className="material-symbols-outlined text-secondary-fixed-dim text-2xl"
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
                  className="w-full bg-surface-container rounded-xl p-3 text-on-surface placeholder-on-surface-variant/50 border border-outline-variant/20 outline-none focus:border-primary resize-none font-body text-sm"
                  rows={3}
                  placeholder="¿Qué te pareció? (opcional)"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
              </div>
              {reviewError && <p className="text-error text-sm font-label">{reviewError}</p>}
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : 'Publicar reseña'}
              </button>
            </div>
          )}

          {reviews.length > 0 ? reviews.map(rev => (
            <div key={rev.id} className="bg-surface-container-lowest rounded-xl p-4 space-y-2 border border-outline-variant/10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-on-surface text-sm">{rev.user?.name || 'Anónimo'}</p>
                  <StarRating rating={rev.rating} />
                </div>
                <span className="text-xs text-on-surface-variant font-label">
                  {new Date(rev.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              {rev.comment && <p className="text-on-surface-variant text-sm leading-relaxed">{rev.comment}</p>}
            </div>
          )) : (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="text-4xl block mb-2">💬</span>
              <p className="font-label font-medium">Sé el primero en dejar una reseña</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
