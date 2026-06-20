export function LoadingGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="h-48 bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-8 bg-slate-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
      <p className="text-slate-500">{message}</p>
    </div>
  );
}
