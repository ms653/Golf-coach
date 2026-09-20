import Link from "next/link";
import { getLessons } from "@/lib/data";
import { formatDate } from "@/lib/data";

export default function LessonsPage() {
  const lessons = getLessons();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-900">Lessons</h1>
        <p className="text-sm text-stone-500">
          Tell Claude about a lesson to log one.
        </p>
      </div>

      {lessons.length === 0 ? (
        <p className="text-sm text-stone-500">
          No lessons logged yet. Tell Claude what your coach said after your
          next lesson and it&apos;ll show up here.
        </p>
      ) : (
        <ol className="space-y-4 border-l-2 border-fairway-200 pl-4">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="relative">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-fairway-500" />
              <Link href={`/lessons/${lesson.id}`} className="card block hover:border-fairway-400">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">
                    {formatDate(lesson.date)} · {lesson.coach}
                  </p>
                  <span className="badge">{lesson.fault_focus}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-stone-700">
                  {lesson.notes}
                </p>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
