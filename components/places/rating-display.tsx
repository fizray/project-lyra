import { cn } from "@/lib/utils";

type RatingDisplayProps = {
  rating: number;
  className?: string;
};

export function clampRating(rating: number) {
  return Math.min(5, Math.max(1, Math.round(rating)));
}

export function RatingDisplay({ rating, className }: RatingDisplayProps) {
  const value = clampRating(rating);
  const filled = "★".repeat(value);
  const empty = "☆".repeat(5 - value);

  return (
    <span className={cn("inline-flex items-center gap-1 text-sm font-medium", className)}>
      <span aria-hidden="true" className="text-primary">
        {filled}
        {empty}
      </span>
      <span>{value}/5</span>
      <span className="sr-only">{value} out of 5</span>
    </span>
  );
}
