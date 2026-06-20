interface StarRatingProps {
  stars: number;
  rating: number;
}

export function StarRating({ stars, rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-amber-500">{"★".repeat(stars)}{"☆".repeat(5 - stars)}</span>
      <span className="text-slate-600">{rating.toFixed(1)}/10</span>
    </div>
  );
}
