import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getReviews,
  getReviewById,
  getProgressAreaById,
  getDrillById,
  getLessonById,
  getSessionById,
  formatDate,
  staticParamsFor,
} from "@/lib/data";

export function generateStaticParams() {
  return staticParamsFor(getReviews());
}

export default function ReviewDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const review = getReviewById(params.id);
  if (!review) notFound();

  const linkedLesson = review.linked_lesson_id
    ? getLessonById(review.linked_lesson_id)
    : undefined;
  const linkedSession = review.linked_session_id
    ? getSessionById(review.linked_session_id)
    : undefined;

  return (
    <div className="space-y-6">
      <Link href="/reviews" className="text-sm text-fairway-700 hover:underline">
        ← All reviews
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{formatDate(review.date)}</h1>
          <span className="badge">{review.type}</span>
        </div>

        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Context
        </h2>
        <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
          {review.context}
        </p>

        {review.observations.length > 0 && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Observations
            </h2>
            <ul className="mt-1 space-y-2">
              {review.observations.map((obs, i) => {
                const area = getProgressAreaById(obs.fault_area);
                return (
                  <li key={i} className="text-sm text-stone-700">
                    {area ? (
                      <Link
                        href={`/progress/${area.id}`}
                        className="badge mr-2 hover:bg-fairway-200"
                      >
                        {area.name}
                      </Link>
                    ) : (
                      <span className="badge mr-2">{obs.fault_area}</span>
                    )}
                    {obs.note}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Verdict
        </h2>
        <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
          {review.verdict}
        </p>

        {review.cues_suggested.length > 0 && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Suggested Cues
            </h2>
            <div className="mt-1 flex flex-wrap gap-1">
              {review.cues_suggested.map((cue) => (
                <span key={cue} className="badge">
                  {cue}
                </span>
              ))}
            </div>
          </>
        )}

        {review.drills_suggested.length > 0 && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Suggested Drills
            </h2>
            <ul className="mt-1 list-inside list-disc text-sm text-stone-700">
              {review.drills_suggested.map((id) => {
                const drill = getDrillById(id);
                return (
                  <li key={id}>
                    {drill ? (
                      <Link href="/drills" className="text-fairway-700 hover:underline">
                        {drill.name}
                      </Link>
                    ) : (
                      id
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {(linkedLesson || linkedSession) && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Linked
            </h2>
            <div className="mt-1 flex flex-wrap gap-3 text-sm">
              {linkedLesson && (
                <Link
                  href={`/lessons/${linkedLesson.id}`}
                  className="text-fairway-700 hover:underline"
                >
                  Lesson on {formatDate(linkedLesson.date)} →
                </Link>
              )}
              {linkedSession && (
                <Link
                  href={`/sessions/${linkedSession.id}`}
                  className="text-fairway-700 hover:underline"
                >
                  Session on {formatDate(linkedSession.date)} →
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
