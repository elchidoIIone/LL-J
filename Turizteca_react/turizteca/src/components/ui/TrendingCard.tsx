import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../../types';

const PRICE_LABEL = ['', '$', '$$', '$$$', '$$$$'];

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

interface TrendingCardProps {
  restaurant: Restaurant;
  rank?: number;
}

const RANK_COLORS: Record<number, string> = {
  1: '#D4960A',
  2: '#1B7A6E',
  3: '#C4501A',
};

export default function TrendingCard({ restaurant, rank }: TrendingCardProps) {
  const navigate = useNavigate();
  const emoji = CUISINE_EMOJI[restaurant.cuisine_type] || '🍽️';
  const gradient = CUISINE_GRADIENTS[restaurant.cuisine_type] || 'from-stone-700 to-amber-800';
  const rating = restaurant.avg_rating ?? (restaurant.reviews?.length
    ? restaurant.reviews.reduce((s, r) => s + r.rating, 0) / restaurant.reviews.length
    : 0);
  const priceIdx = Math.min(Math.ceil((restaurant.average_price || 1) / 150), 4);
  const showRank = rank !== undefined && rank <= 3;
  const rankColor = showRank ? RANK_COLORS[rank as 1 | 2 | 3] : null;

  return (
    <div
      className="flex items-center bg-white p-3 rounded-2xl shadow-[0_4px_15px_rgba(74,37,7,0.06)] border border-outline-variant/15 cursor-pointer hover:shadow-[0_8px_24px_rgba(196,80,26,0.12)] hover:border-primary/30 transition-all duration-200 active:scale-[0.99]"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      {/* Imagen con ranking */}
      <div className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-4xl drop-shadow-md select-none">{emoji}</span>

        {showRank && rankColor && (
          <div
            className="absolute -top-1.5 -left-1.5 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg ring-2 ring-white text-on-primary"
            style={{ background: rankColor }}
          >
            #{rank}
          </div>
        )}
      </div>

      <div className="ml-4 flex-grow space-y-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-headline text-base font-bold text-on-surface leading-tight truncate flex-1">
            {restaurant.name}
          </h4>
          {priceIdx > 0 && (
            <span className="text-primary font-black text-sm shrink-0 tracking-tight">
              {PRICE_LABEL[priceIdx]}
            </span>
          )}
        </div>

        <div className="flex items-center text-xs text-on-surface-variant font-medium">
          <span
            className="material-symbols-outlined text-[14px] mr-1 text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
          <span className="truncate">
            {restaurant.description?.slice(0, 38) || 'Sabor local por descubrir'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
              {CUISINE_LABELS[restaurant.cuisine_type]}
            </span>
            {rating > 0 && (
              <div className="flex items-center text-xs">
                <span
                  className="material-symbols-outlined text-[14px] mr-0.5 text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="font-black text-on-surface">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          {restaurant.sponsorship && (
            <span
              className="text-[9px] font-black uppercase tracking-tighter"
              style={{
                color: restaurant.sponsorship.visibility_level === 'premium' ? '#D4960A' : '#1B7A6E',
              }}
            >
              ◆ {restaurant.sponsorship.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
