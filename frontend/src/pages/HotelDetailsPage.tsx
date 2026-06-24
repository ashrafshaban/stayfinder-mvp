import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useHotel, trackAffiliateClick } from "../hooks/useHotels";
import { getSessionId } from "../hooks/useSessionId";
import { formatPrice } from "../utils/format";
import { StarRating } from "../components/StarRating";
import { LoadingGrid } from "../components/LoadingGrid";

export function HotelDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: hotel, isLoading, error } = useHotel(id ?? "");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const handleBookNow = async () => {
    if (!hotel) return;
    setIsBooking(true);
    setBookingError(null);
    try {
      await trackAffiliateClick(hotel.id, getSessionId());
      window.open(hotel.affiliateUrl, "_blank", "noopener,noreferrer");
    } catch {
      setBookingError("Could not track click, but you can still book directly.");
      window.open(hotel.affiliateUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingGrid />
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 mb-4">Hotel not found.</p>
        <Link to="/" className="text-brand-600 hover:underline">Back to home</Link>
      </div>
    );
  }

  const galleryImages = [
    hotel.imageUrl,
    `https://picsum.photos/seed/${hotel.id}-1/800/600`,
    `https://picsum.photos/seed/${hotel.id}-2/800/600`,
    `https://picsum.photos/seed/${hotel.id}-3/800/600`,
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to={`/search?destination=${hotel.city}`} className="text-sm text-brand-600 hover:underline mb-4 inline-block">
        &larr; Back to {hotel.city}
      </Link>

      <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-72 md:h-96 object-cover rounded-xl" />

      <div className="grid grid-cols-4 gap-2 mt-2">
        {galleryImages.slice(1).map((url, i) => (
          <img key={i} src={url} alt="" className="h-20 object-cover rounded-lg" />
        ))}
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <p className="text-slate-500 mt-1">{hotel.city}, {hotel.country}</p>
            <div className="mt-3">
              <StarRating stars={hotel.stars} rating={hotel.rating} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-brand-700">{formatPrice(hotel.pricePerNight)}</p>
            <p className="text-sm text-slate-500">per night</p>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.map((a) => (
              <span key={a.id} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                {a.name}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Location</h2>
          <p className="text-slate-600">
            Coordinates: {hotel.latitude.toFixed(4)}, {hotel.longitude.toFixed(4)}
          </p>
          <a
            href={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 text-sm hover:underline mt-1 inline-block"
          >
            View on Google Maps
          </a>
        </section>

        <div className="bg-white border border-slate-200 rounded-xl p-6 sticky bottom-4 shadow-lg">
          {bookingError && (
            <p className="text-amber-600 text-sm mb-2">{bookingError}</p>
          )}
          <button
            onClick={handleBookNow}
            disabled={isBooking}
            className="w-full bg-brand-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isBooking ? "Redirecting..." : "Book Now"}
          </button>
          <p className="text-xs text-slate-400 text-center mt-2">
            You will be redirected to our booking partner
          </p>
        </div>
      </div>
    </div>
  );
}
