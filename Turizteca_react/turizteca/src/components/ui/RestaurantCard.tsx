import { useNavigate } from 'react-router-dom';
import type { Restaurant } from '../../types';
import { CUISINE_LABELS, CUISINE_EMOJI } from '../../types';

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

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();
  const gradient = CUISINE_GRADIENTS[restaurant.cuisine_type] || 'from-stone-700 to-amber-800';
  const emoji = CUISINE_EMOJI[restaurant.cuisine_type] || '🍽️';
  const rating = restaurant.avg_rating ?? (restaurant.reviews?.length
    ? restaurant.reviews.reduce((s, r) => s + r.rating, 0) / restaurant.reviews.length
    : 0);
  const sponsorLabel = restaurant.sponsorship?.visibility_level === 'premium'
    ? 'Local Legend' : restaurant.sponsorship?.visibility_level === 'featured'
    ? 'Destacado' : null;

  return (
    <div
      className="flex-none w-72 relative group cursor-pointer"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="h-96 w-full rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(74,37,7,0.1)] relative">
        <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-700`}>
          <span className="text-8xl opacity-60 select-none">{emoji}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-tertiary/70 backdrop-blur-md rounded-t-xl mx-2 mb-2">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-headline text-lg font-bold text-on-tertiary truncate">{restaurant.name}</h4>
            {rating > 0 && (
              <div className="flex items-center bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-2">
                <span className="material-symbols-outlined text-[12px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                {rating.toFixed(1)}
              </div>
            )}
          </div>
          <p className="text-on-tertiary/80 text-xs font-medium">{CUISINE_LABELS[restaurant.cuisine_type]}</p>
        </div>

        {sponsorLabel && (
          <div className="absolute top-3 left-3 bg-primary-dim text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter">
            {sponsorLabel}
          </div>
        )}
      </div>
    </div>
  );
}
