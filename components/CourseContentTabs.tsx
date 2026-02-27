import { FlashcardDeckProps, QuizProps, TopicProps } from "@/types/Props";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function Topics() {
  return (
    <section className="bg-white rounded-lg border-2 border-gray-300 px-10 py-7 min-h-[100px]">
      <div className="flex gap-5">
        <div>1</div>
        <div className="flex flex-col">
          <div>topic 1</div>
          <div>description</div>
          <div>description</div>
        </div>
        <div className="ml-auto">
          <div>icon1</div>
          {/*  only creator can see */}
          <div>icon2</div>
        </div>
      </div>
    </section>
  );
}

export function Topics2({
  handleNavigate,
  handleDel,
  index,
  topic,
  isOwner,
}: TopicProps) {
  return (
    <section
      key={topic.orderIndex}
      // คลิกที่การ์ดแล้วไปหน้า Topic Detail
      onClick={() => handleNavigate(topic.topicId)}
      className="bg-white rounded-lg border-2 border-gray-200 px-10 py-7 min-h-[100px] hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
    >
      <div className="flex gap-5 items-start">
        <div className="font-bold text-gray-400 text-xl shrink-0 group-hover:text-blue-500">
          #{index + 1}
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <div className="font-bold text-lg text-gray-800 line-clamp-2 break-words">
            {topic.title}
          </div>
          <div className="break-words text-gray-600 line-clamp-2">
            {topic.description}
          </div>
        </div>

        <div className="ml-auto shrink-0 flex gap-2 items-center">
          {/* ปุ่ม Delete */}
          {isOwner ? (
            <button
              onClick={(e) => handleDel(e, topic.topicId)}
              className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
              title="Delete Topic"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function Flashcards() {
  return (
    <section className="bg-white rounded-lg border-2 border-gray-300 px-10 py-7 min-h-[100px]">
      <div className="flex gap-5">
        <div>1</div>
        <div className="flex flex-col">
          <div>Deck name</div>
          <div>n topics</div>
          <div>topic : 1 2 3</div>
        </div>
        <div className="ml-auto">
          <div>edit</div>
        </div>
      </div>
    </section>
  );
}

export function Quizzes({
  handleNavigateTo,
  handleNavigateEdit,
  index,
  quiz,
  isOwner,
}: QuizProps) {
  return (
    <section
      // คลิกที่การ์ดแล้วไปหน้า Topic Detail
      onClick={() => handleNavigateTo(quiz.quiz_id)}
      className="bg-white rounded-lg border-2 border-gray-200 px-10 py-7 min-h-[100px] hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
    >
      <div className="flex gap-5 items-start">
        <div className="font-bold text-gray-400 text-xl shrink-0 group-hover:text-blue-500">
          #{index + 1}
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="flex items-center gap-3">
            <div className="font-bold text-lg text-gray-800 line-clamp-2 break-words">
              {quiz.title}
            </div>
            {/* Badge แสดงสถานะการมองเห็นเฉลย */}
            <span
              className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                quiz.solution_visibility === "ALWAYS"
                  ? "bg-green-100 text-green-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              Solution:{" "}
              {quiz.solution_visibility === "ALWAYS" ? "Visible" : "Hidden"}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700">
                {quiz.question_count}
              </span>{" "}
              Questions
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            {/* <div className="italic">
                Solution: {quiz.solution_visibility === "ALWAYS" ? "Visible" : "Hidden"}
             </div> */}
          </div>
        </div>
        {isOwner ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateEdit(quiz.quiz_id);
            }}
            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function FlashcardDecks({
  handleNavigateTo,
  handleNavigateEdit,
  index,
  deck,
  isOwner,
}: FlashcardDeckProps) {
  return (
    <section
      // คลิกที่การ์ดแล้วไปหน้า Topic Detail
      onClick={() => handleNavigateTo(deck.deck_id)}
      className="bg-white rounded-lg border-2 border-gray-200 px-10 py-7 min-h-[100px] hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
    >
      <div className="flex gap-5 items-start">
        <div className="font-bold text-gray-400 text-xl shrink-0 group-hover:text-blue-500">
          #{index + 1}
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <div className="flex items-center gap-3">
            <div className="font-bold text-lg text-gray-800 line-clamp-2 break-words">
              {deck.title}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700">
                {deck.card_count}
              </span>{" "}
              Questions
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>
        {isOwner ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNavigateEdit(deck.deck_id);
            }}
            className="flex items-center gap-2 text-gray-600 cursor-pointer hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit
          </button>
        ) : null}
      </div>
    </section>
  );
}