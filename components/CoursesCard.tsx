import { CourseMetaData } from "@/types/Course";
import Link from "next/link";

export default function CoursesCard({
  id,
  title,
  description,
  is_published,
  totalTopics,
}: CourseMetaData) {
  return (
    <div className="flex flex-col max-w-full py-7 px-5 gap-4 bg-white rounded-lg border-2 border-gray-300 text-wrap">
      <div className="flex justify-between">
        <h4 className="text-l font-bold">{title}</h4>
        {is_published ? (
          <div className="text-green-500 bg-green-200 px-2 py-1 rounded-lg font-bold text-sm h-fit">
            Public
          </div>
        ) : (
          <div className="text-gray-500 bg-gray-200 px-2 py-1 rounded-lg font-bold text-sm h-fit">
            Private
          </div>
        )}
      </div>
      <p className="break-all">{description}</p>
      <div className="flex justify-between text-gray-500">
        <div>{totalTopics} topics</div>
        {/* <div>total quizzes</div> */}
      </div>

      <Link
        href={`/course/${id}`}
        className="bg-blue-500 text-white font-bold p-2 rounded-lg text-center hover:bg-blue-600"
      >
        View
      </Link>
    </div>
  );
}
