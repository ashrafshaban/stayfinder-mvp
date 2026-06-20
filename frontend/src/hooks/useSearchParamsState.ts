import { useSearchParams } from "react-router-dom";
import { SearchParams, SortOption, TravelPurpose } from "../types";

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

const PURPOSES: TravelPurpose[] = ["business", "family", "romantic", "luxury", "budget"];
const SORTS: SortOption[] = ["recommended", "price_asc", "rating_desc"];

export function useSearchParamsState(): [SearchParams, (updates: Partial<SearchParams>) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: SearchParams = {
    destination: searchParams.get("destination") ?? undefined,
    budget: parseNumber(searchParams.get("budget")),
    purpose: PURPOSES.includes(searchParams.get("purpose") as TravelPurpose)
      ? (searchParams.get("purpose") as TravelPurpose)
      : undefined,
    minPrice: parseNumber(searchParams.get("minPrice")),
    maxPrice: parseNumber(searchParams.get("maxPrice")),
    minStars: parseNumber(searchParams.get("minStars")),
    maxStars: parseNumber(searchParams.get("maxStars")),
    minRating: parseNumber(searchParams.get("minRating")),
    amenities: searchParams.get("amenities") ?? undefined,
    sort: SORTS.includes(searchParams.get("sort") as SortOption)
      ? (searchParams.get("sort") as SortOption)
      : "recommended",
    page: parseNumber(searchParams.get("page")) ?? 1,
  };

  const update = (updates: Partial<SearchParams>) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries({ ...params, ...updates })) {
      if (value === undefined || value === "") {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }
    if (!updates.page) next.set("page", "1");
    setSearchParams(next);
  };

  return [params, update];
}

export function paramsToQueryString(params: Partial<SearchParams>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") sp.set(key, String(value));
  }
  return sp.toString();
}
