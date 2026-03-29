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
      onClick={() => handleNavigate(topic.topicId)}
      /* ✅ ใช้ Style 1: rounded-3xl, border-gray-200, shadow-md และ Hover effects ที่ชัดเจน */
      className="bg-white rounded-3xl border border-gray-200 p-8 min-h-[110px] shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    >
      <div className="flex gap-6 items-start">
        {/* 🔢 Index Indicator: ปรับสไตล์ให้ดูพรีเมียมขึ้น */}
        <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-300 shadow-sm">
          {index + 1}
        </div>

        {/* 📝 Content Area */}
        <div className="flex flex-col flex-1 min-w-0 gap-2">
          <h4 className="font-black text-lg text-gray-900 uppercase leading-tight line-clamp-1">
            {topic.title}
          </h4>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
            {topic.description ||
              "No additional description available for this topic."}
          </p>
        </div>

        {/* <div className="ml-auto shrink-0 flex gap-2 items-center">
          {isOwner && (
            <button
              onClick={(e) => handleDel(e, topic.topicId)}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-all active:scale-90"
              title="Delete Topic"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </button>
          )}

          <div className="text-gray-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div> */}
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
      onClick={() => handleNavigateTo(quiz.quiz_id)}
      /* ✅ Style 1: เพิ่ม relative เพื่อล็อคตำแหน่งปุ่ม Edit และใช้ rounded-3xl พร้อม shadow-md */
      className="relative bg-white rounded-3xl border border-gray-200 p-8 min-h-[140px] shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
    >
      {/* ⚙️ Edit Button: ย้ายไปมุมขวาบน */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigateEdit(quiz.quiz_id);
          }}
          className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-90  cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          Edit
        </button>
      )}

      <div className="flex gap-5 items-start">
        {/* 🔢 Index Indicator */}
        <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-300">
          {index + 1}
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-3">
          <div className="flex flex-col gap-2">
            {/* ปรับ mr-20 เพื่อกันข้อความยาวไปทับปุ่ม Edit */}
            <h4 className="font-black text-lg text-gray-900 uppercase leading-tight mr-20">
              {quiz.title}
            </h4>

            {/* 🏷️ Status Badges */}
            <div className="flex flex-wrap gap-2">
              {quiz.is_published ? (
                <span className="text-[10px] uppercase px-3 py-1 rounded-full font-black tracking-wider border bg-green-50 text-green-600 border-green-100 shadow-sm">
                  Public
                </span>
              ) : (
                <span className="text-[10px] uppercase px-3 py-1 rounded-full font-black tracking-wider border bg-gray-100 text-gray-500 border-gray-200 shadow-sm">
                  Private
                </span>
              )}

              <span
                className={`text-[10px] uppercase px-3 py-1 rounded-full font-black tracking-wider border shadow-sm ${
                  quiz.solution_visibility === "ALWAYS"
                    ? "bg-green-50 text-green-600 border-green-100"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                }`}
              >
                Solution: {quiz.solution_visibility === "ALWAYS" ? "Visible" : "Hidden"}
              </span>
            </div>
          </div>

          {/* 📊 Metadata Area */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>{quiz.question_count} Questions</span>
            </div>
          </div>
        </div>
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
      onClick={() => handleNavigateTo(deck.deck_id)}
      /* ✅ Style 1: เพิ่ม relative เพื่อให้ลูกที่ใช้ absolute อ้างอิงตำแหน่งได้ */
      className="relative bg-white rounded-3xl border border-gray-200 p-8 min-h-[140px] shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
    >
      {/* ⚙️ Edit Button: ย้ายไปมุมขวาบน */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNavigateEdit(deck.deck_id);
          }}
          className="absolute top-5 right-5 z-10 flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-90 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
          Edit
        </button>
      )}

      <div className="flex gap-5 items-start">
        {/* 🔢 Index Indicator */}
        <div className="w-12 h-12 shrink-0 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-300">
          {index + 1}
        </div>

        <div className="flex flex-col flex-1 min-w-0 gap-3">
          <div className="flex flex-col gap-2">
            {/* ปรับ margin-right เพื่อไม่ให้ชื่อทับกับปุ่ม Edit */}
            <h4 className="font-black text-lg text-gray-900 uppercase leading-tight mr-16">
              {deck.title}
            </h4>

            {/* 🏷️ Status Badges */}
            <div className="flex flex-wrap gap-2">
              {deck.is_published ? (
                <span className="shrink-0 text-[10px] font-black uppercase px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full shadow-sm tracking-widest">
                  Public
                </span>
              ) : (
                <span className="shrink-0 text-[10px] font-black uppercase px-3 py-1 bg-gray-100 text-gray-500 border border-gray-200 rounded-full shadow-sm tracking-widest">
                  Private
                </span>
              )}
            </div>
          </div>

          {/* 📊 Metadata Area */}
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /></svg>
              <span>{deck.card_count} Cards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}