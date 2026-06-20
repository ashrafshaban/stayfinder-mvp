import { useAmenities } from "../hooks/useHotels";
import { SearchParams, SortOption, TravelPurpose } from "../types";

interface FiltersProps {
  params: SearchParams;
  onChange: (updates: Partial<SearchParams>) => void;
  showPurpose?: boolean;
}

const PURPOSES: { value: TravelPurpose; label: string }[] = [
  { value: "business", label: "Business" },
  { value: "family", label: "Family" },
  { value: "romantic", label: "Romantic" },
  { value: "luxury", label: "Luxury" },
  { value: "budget", label: "Budget" },
];

const SORTS: { value: SortOption; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Lowest Price" },
  { value: "rating_desc", label: "Highest Rating" },
];

export function Filters({ params, onChange, showPurpose = true }: FiltersProps) {
  const { data: amenities } = useAmenities();
  const selectedAmenities = params.amenities?.split(",").filter(Boolean) ?? [];

  const toggleAmenity = (slug: string) => {
    const set = new Set(selectedAmenities);
    if (set.has(slug)) set.delete(slug);
    else set.add(slug);
    onChange({ amenities: Array.from(set).join(",") || undefined });
  };

  return (
    <aside className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
      <h2 className="font-semibold text-slate-800">Filters</h2>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Destination</label>
        <input
          type="text"
          value={params.destination ?? ""}
          onChange={(e) => onChange({ destination: e.target.value || undefined })}
          placeholder="City or country"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Min Price</label>
          <input
            type="number"
            value={params.minPrice ?? ""}
            onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Max Price</label>
          <input
            type="number"
            value={params.maxPrice ?? ""}
            onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Min Stars</label>
          <select
            value={params.minStars ?? ""}
            onChange={(e) => onChange({ minStars: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((s) => (
              <option key={s} value={s}>{s}+ stars</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Min Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={params.minRating ?? ""}
            onChange={(e) => onChange({ minRating: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {showPurpose && (
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Travel Purpose</label>
          <select
            value={params.purpose ?? ""}
            onChange={(e) => onChange({ purpose: (e.target.value as TravelPurpose) || undefined })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            {PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Sort By</label>
        <select
          value={params.sort ?? "recommended"}
          onChange={(e) => onChange({ sort: e.target.value as SortOption })}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {amenities && amenities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => toggleAmenity(a.slug)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  selectedAmenities.includes(a.slug)
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-slate-600 border-slate-300 hover:border-brand-400"
                }`}
              >
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
