import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { paramsToQueryString } from "../hooks/useSearchParamsState";
import { TravelPurpose } from "../types";

const DESTINATIONS = ["Cairo", "Dubai", "London", "Paris", "Istanbul", "Riyadh"];

const PURPOSES: { value: TravelPurpose; label: string }[] = [
  { value: "business", label: "Business" },
  { value: "family", label: "Family" },
  { value: "romantic", label: "Romantic" },
  { value: "luxury", label: "Luxury" },
  { value: "budget", label: "Budget" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState<TravelPurpose | "">("");

  const baseParams = {
    destination: destination || undefined,
    budget: budget ? Number(budget) : undefined,
    purpose: purpose || undefined,
  };

  const handleSearch = () => {
    if (!destination.trim()) return;
    navigate(`/search?${paramsToQueryString(baseParams)}`);
  };

  const handleRecommendations = () => {
    if (!destination.trim()) return;
    navigate(`/recommendations?${paramsToQueryString(baseParams)}`);
  };

  return (
    <div className="relative">
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-brand-100 text-lg mb-10">
            Discover hotels tailored to your budget, travel style, and preferences.
          </p>

          <div className="bg-white rounded-2xl p-6 text-left shadow-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input
                list="destinations"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City or country"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900"
              />
              <datalist id="destinations">
                {DESTINATIONS.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Budget (per night)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Travel Purpose
                </label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value as TravelPurpose | "")}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900"
                >
                  <option value="">Select purpose</option>
                  {PURPOSES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
              >
                Find Hotels
              </button>
              <button
                onClick={handleRecommendations}
                className="flex-1 border-2 border-brand-600 text-brand-700 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
              >
                Get Recommendations
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Popular Destinations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DESTINATIONS.map((city) => (
            <Link
              key={city}
              to={`/search?destination=${city}`}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-brand-400 hover:shadow-md transition-all text-center"
            >
              <span className="text-lg font-semibold text-slate-800">{city}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
