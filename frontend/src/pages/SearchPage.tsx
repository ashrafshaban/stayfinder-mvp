import { useHotels } from "../hooks/useHotels";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { Filters } from "../components/Filters";
import { HotelCard } from "../components/HotelCard";
import { LoadingGrid, EmptyState } from "../components/LoadingGrid";

export function SearchPage() {
  const [params, updateParams] = useSearchParamsState();
  const { data, isLoading, error } = useHotels({
    ...params,
    stars: params.minStars,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Hotels in {params.destination ?? "All Destinations"}
      </h1>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <Filters params={params} onChange={updateParams} />

        <div>
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
              Failed to load hotels. Please try again.
            </div>
          )}

          {isLoading && <LoadingGrid />}

          {!isLoading && data && data.data.length === 0 && (
            <EmptyState message="No hotels found. Try adjusting your filters." />
          )}

          {!isLoading && data && data.data.length > 0 && (
            <>
              <p className="text-sm text-slate-500 mb-4">
                {data.pagination.total} hotels found
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {data.data.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    showScore={params.sort === "recommended" && !!params.budget}
                  />
                ))}
              </div>

              {data.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    disabled={params.page === 1}
                    onClick={() => updateParams({ page: (params.page ?? 1) - 1 })}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm text-slate-600">
                    Page {params.page} of {data.pagination.totalPages}
                  </span>
                  <button
                    disabled={params.page === data.pagination.totalPages}
                    onClick={() => updateParams({ page: (params.page ?? 1) + 1 })}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
