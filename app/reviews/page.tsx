import Link from "next/link";
import { getReviews, formatDate } from "@/lib/data";

export default function ReviewsPage() {
  const reviews = getReviews();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-stone-900">Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-sm text-stone-500">
          No swing reviews logged yet.
        </p>
      ) : (
        <ol className="space-y-4 border-l-2 border-fairway-200 pl-4">
          {reviews.map((review) => (
            <li key={review.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-fairway-500" />
              <Link href={`/reviews/${review.id}`} className="card block hover:border-fairway-400">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">
                    {formatDate(review.date)}
                  </p>
                  <span className="badge">{review.type}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-stone-700">
                  {review.context}
                </p>
                <p className="mt-1 line-clamp-2 text-sm italic text-stone-600">
                  {review.verdict}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
