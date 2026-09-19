import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessons, getLessonById, getDrillById, formatDate } from "@/lib/data";

export function generateStaticParams() {
  const lessons = getLessons();
  // `output: export` requires at least one static param per dynamic route.
  if (lessons.length === 0) return [{ id: "_none" }];
  return lessons.map((l) => ({ id: l.id }));
}

export default function LessonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lesson = getLessonById(params.id);
  if (!lesson) notFound();

  return (
    <div className="space-y-6">
      <Link href="/lessons" className="text-sm text-fairway-700 hover:underline">
        ← All lessons
      </Link>

      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{formatDate(lesson.date)}</h1>
          <span className="badge">{lesson.fault_focus}</span>
        </div>
        <p className="mt-1 text-sm text-stone-500">Coach: {lesson.coach}</p>

        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
          Notes
        </h2>
        <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
          {lesson.notes}
        </p>

        {lesson.cues.length > 0 && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Key Cues
            </h2>
            <div className="mt-1 flex flex-wrap gap-1">
              {lesson.cues.map((cue) => (
                <span key={cue} className="badge">
                  {cue}
                </span>
              ))}
            </div>
          </>
        )}

        {lesson.drills_recommended.length > 0 && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Drills Recommended
            </h2>
            <ul className="mt-1 list-inside list-disc text-sm text-stone-700">
              {lesson.drills_recommended.map((id) => {
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

        {lesson.video_review_notes && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-fairway-700">
              Video Review Notes
            </h2>
            <p className="mt-1 whitespace-pre-wrap text-sm text-stone-700">
              {lesson.video_review_notes}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
