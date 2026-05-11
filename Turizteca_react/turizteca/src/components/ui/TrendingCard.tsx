import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../../types';

const PRICE_LABEL = ['', '$', '$$', '$$$', '$$$$'];

interface TrendingCardProps {
  restaurant: Restaurant;
}

export default function TrendingCard({ restaurant }: TrendingCardProps) {
  const navigate = useNavigate();
  const emoji = CUISINE_EMOJI[restaurant.cuisine_type] || '🍽️';
  const rating = restaurant.avg_rating ?? (restaurant.reviews?.length
    ? restaurant.reviews.reduce((s, r) => s + r.rating, 0) / restaurant.reviews.length
    : 0);
  const priceIdx = Math.min(Math.ceil((restaurant.average_price || 1) / 150), 4);

  return (
    <div
      className="flex items-center bg-surface-container-lowest p-3 rounded-xl shadow-[0_4px_15px_rgba(74,37,7,0.04)] border border-outline-variant/10 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-surface-container to-surface-dim flex items-center justify-center">
        <span className="text-4xl">{emoji}</span>
      </div>

      <div className="ml-4 flex-grow space-y-1">
        <div className="flex justify-between items-start">
          <h4 className="font-headline text-base font-bold text-on-surface leading-tight">{restaurant.name}</h4>
          <span className="text-secondary font-bold text-xs">{PRICE_LABEL[priceIdx]}</span>
        </div>
        <div className="flex items-center text-xs text-on-surface-variant font-medium">
          <span className="material-symbols-outlined text-[14px] mr-1 text-primary">location_on</span>
          {restaurant.description?.slice(0, 30) || 'Restaurante local'}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <span className="bg-surface-container-high px-2 py-0.5 rounded-md text-[10px] text-on-surface-variant font-bold uppercase">
              {CUISINE_LABELS[restaurant.cuisine_type]}
            </span>
            {rating > 0 && (
              <div className="flex items-center text-secondary-dim text-xs font-bold">
                <span className="material-symbols-outlined text-[14px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {rating.toFixed(1)}
              </div>
            )}
          </div>
          {restaurant.sponsorship && (
            <span className="text-[10px] text-primary font-bold uppercase">
              {restaurant.sponsorship.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
