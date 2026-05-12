import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../../types';
import AztecStamp from './AztecStamp';
import AztecDivider from './AztecDivider';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

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

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();
  const gradient = CUISINE_GRADIENTS[restaurant.cuisine_type] || 'from-stone-700 to-amber-800';
  const emoji = CUISINE_EMOJI[restaurant.cuisine_type] || '🍽️';
  const rating = restaurant.avg_rating ?? (restaurant.reviews?.length
    ? restaurant.reviews.reduce((s, r) => s + r.rating, 0) / restaurant.reviews.length
    : 0);
  const priceIdx = Math.min(Math.ceil((restaurant.average_price || 1) / 150), 4);

  const sponsorTier = restaurant.sponsorship?.visibility_level;
  const sponsorLabel = sponsorTier === 'premium'
    ? 'Local Legend' : sponsorTier === 'featured'
    ? 'Destacado' : null;
  const sponsorColor = sponsorTier === 'premium' ? '#D4960A' : '#1B7A6E';

  return (
    <div
      className="flex-none w-72 cursor-pointer group"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="rounded-3xl overflow-hidden bg-white shadow-[0_8px_28px_rgba(74,37,7,0.12)] border border-outline-variant/20 transition-all duration-300 group-hover:shadow-[0_16px_40px_rgba(196,80,26,0.2)] group-hover:-translate-y-1 group-active:translate-y-0 group-active:scale-[0.98]">

        {/* Top — gradiente con sello azteca */}
        <div className={`relative h-52 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          {/* Textura sutil de puntos */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 1.2px, transparent 1.6px), radial-gradient(circle at 70% 80%, #fff 1.2px, transparent 1.6px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* Sello azteca con emoji */}
          <AztecStamp color="#FBF4E8" size={128}>
            <span className="text-5xl drop-shadow-lg select-none">{emoji}</span>
          </AztecStamp>

          {/* Badge de patrocinio */}
          {sponsorLabel && (
            <div
              className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-md text-on-primary"
              style={{ background: sponsorColor }}
            >
              {sponsorLabel}
            </div>
          )}

          {/* Divisor azteca al pie del gradiente */}
          <div className="absolute bottom-0 left-0 right-0">
            <AztecDivider color="#FBF4E8" inverted={true} />
          </div>
        </div>

        {/* Bottom — info */}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h4 className="font-headline text-lg font-bold text-on-surface leading-tight truncate flex-1">
              {restaurant.name}
            </h4>
            {rating > 0 && (
              <div
                className="flex items-center gap-0.5 shrink-0 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245, 200, 66, 0.22)' }}
              >
                <span
                  className="material-symbols-outlined text-tertiary text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="text-xs font-black text-on-surface">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-on-surface-variant text-xs mb-3 line-clamp-1">
            {restaurant.description || 'Un sabor que vale la pena descubrir.'}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15">
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-secondary" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                {CUISINE_LABELS[restaurant.cuisine_type]}
              </span>
            </div>
            {priceIdx > 0 && (
              <span className="text-sm font-black text-primary tracking-tight">
                {PRICE_LABEL[priceIdx]}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
