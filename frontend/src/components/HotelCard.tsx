import { Link } from "react-router-dom";
import { Hotel } from "../types";
import { formatPrice } from "../utils/format";
import { RecommendationBadge } from "./RecommendationBadge";
import { StarRating } from "./StarRating";

interface HotelCardProps {
  hotel: Hotel;
  showScore?: boolean;
}

export function HotelCard({ hotel, showScore = false }: HotelCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/hotels/${hotel.id}`}>
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </Link>
      <div className="p-4 space-y-3">
        {showScore && hotel.score !== undefined && (
          <RecommendationBadge score={hotel.score} reasons={hotel.matchReasons} />
        )}
        <div>
          <Link to={`/hotels/${hotel.id}`} className="hover:text-brand-600">
            <h3 className="font-semibold text-lg">{hotel.name}</h3>
          </Link>
          <p className="text-sm text-slate-500">
            {hotel.city}, {hotel.country}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <StarRating stars={hotel.stars} rating={hotel.rating} />
          <span className="font-bold text-brand-700">{formatPrice(hotel.pricePerNight)}/night</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {hotel.amenities.slice(0, 4).map((a) => (
            <span key={a.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {a.name}
            </span>
          ))}
        </div>
        <Link
          to={`/hotels/${hotel.id}`}
          className="block text-center bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
