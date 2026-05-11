interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, max = 5, size = 'sm' }: StarRatingProps) {
  const iconSize = size === 'sm' ? 'text-xs' : 'text-base';
  return (
    <div className="flex items-center text-secondary-fixed-dim">
      {Array.from({ length: max }).map((_, i) => {
        const fill = i < Math.floor(rating) ? 1 : i < rating ? 0.5 : 0;
        return (
          <span
            key={i}
            className={`material-symbols-outlined ${iconSize}`}
            style={{ fontVariationSettings: `'FILL' ${fill > 0.4 ? 1 : 0}` }}
          >
            {fill >= 0.5 ? 'star' : 'star_border'}
          </span>
        );
      })}
    </div>
  );
}
