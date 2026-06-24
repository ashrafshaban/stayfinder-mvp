import { formatScore } from "../utils/format";

interface RecommendationBadgeProps {
  score: number;
  reasons?: string[];
}

export function RecommendationBadge({ score, reasons }: RecommendationBadgeProps) {
  return (
    <div className="bg-brand-50 border border-brand-100 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-brand-700">{formatScore(score)}</span>
      </div>
      {reasons && reasons.length > 0 && (
        <p className="text-sm text-slate-600 mt-1">{reasons.join(". ")}</p>
      )}
    </div>
  );
}
