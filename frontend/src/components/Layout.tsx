import { Link } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-brand-700">
            StayFinder
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-slate-600 hover:text-brand-600">
              Home
            </Link>
            <Link to="/search?destination=Cairo" className="text-slate-600 hover:text-brand-600">
              Search
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-900 text-slate-300 text-sm py-8">
        <div className="max-w-6xl mx-auto px-4">
          <p className="mb-2">
            StayFinder helps you discover hotels and book through our affiliate partners.
          </p>
          <p className="text-slate-500">
            We may earn a commission when you book through links on this site. Prices and
            availability are subject to change.
          </p>
        </div>
      </footer>
    </div>
  );
}
