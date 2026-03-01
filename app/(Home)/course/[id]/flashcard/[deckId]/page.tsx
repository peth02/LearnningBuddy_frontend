"use client";

import { getCourseByID } from "@/services/course";
import { getDeckByDeckId } from "@/services/flashcard";
import { Course, FlashcardDeck2, Quiz2 } from "@/types/Course";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Quiz() {
  const [course, setCourse] = useState<Course>();
  const [deck, setDeck] = useState<FlashcardDeck2>();

  // 1. เพิ่ม State สำหรับควบคุมการเปิด-ปิด (ไว้ที่ส่วนบนของ Component)
  const [showTopics, setShowTopics] = useState(false);

  const router = useRouter();
  const params = useParams();

  const deck_id = params.deckId;
  const course_id = params.id;

  // 1. หา Unique Topic IDs จากคำถามทั้งหมดที่มีใน Quiz
  const uniqueTopicIds = Array.from(
    new Set(deck?.cards?.map((c) => c.topic_id?.toString())),
  );

  // 2. Map Topic IDs ไปเป็นข้อมูลรายละเอียดจาก Course
  const topicsInDeck = uniqueTopicIds
    .map((id) => {
      // ค้นหาหัวข้อที่มี topicId ตรงกันในข้อมูล Course
      return course?.topics?.find((t: any) => t.topicId.toString() === id);
    })
    .filter(Boolean); // กรองค่าที่เป็น undefined ออกกรณีหาไม่เจอ

  useEffect(() => {
    if (!deck_id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response1 = await getCourseByID(course_id);
        setCourse(response1);

        const response2 = await getDeckByDeckId(deck_id);
        setDeck(response2);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [deck_id]);

  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      {/* 2. Main Content Card */}
      <section className="bg-white rounded-2xl shadow-sm p-10 flex flex-col gap-8">
        <button
          onClick={() => router.push(`/course/${course_id}`)}
          className="text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm font-semibold transition cursor-pointer"
        >
          ← Back to Course
        </button>
        {/* Quiz Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {deck?.title || "Quiz Title"}
          </h1>
        </div>

        {/* 3. Stats Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Questions */}
          <div className="bg-blue-50 p-6 rounded-xl flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase">
                Total Questions
              </p>
              <p className="text-lg font-bold text-gray-800">
                {deck?.cards?.length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Topics in this deck section */}
        <div className="flex flex-col gap-4">
          {/* ส่วนหัวข้อที่กด Toggle ได้ */}
          <button
            onClick={() => setShowTopics(!showTopics)}
            className="flex items-center justify-between w-full bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors group"
          >
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
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
                className="text-blue-500"
              >
                <path d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Topics in this deck
              <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {topicsInDeck.length}
              </span>
            </h3>

            {/* ไอคอนลูกศรบอกสถานะ */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`text-gray-400 transition-transform duration-300 ${showTopics ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {/* รายการ Topics ที่จะยืด-หดตามสถานะ showTopics */}
          <div
            className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out ${
              showTopics ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            {topicsInDeck.length > 0 ? (
              topicsInDeck.map((topic, index) => (
                <div
                  key={topic?.topicId || index}
                  className="border border-gray-100 bg-white p-4 rounded-xl flex items-center gap-4 hover:border-blue-200 transition-all"
                >
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-sm">
                      {topic?.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {topic?.description || "No description available."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic pl-2">
                No topics assigned.
              </p>
            )}
          </div>
        </div>

        {/* 6. Instructions Card */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div>
            <ul className="text-xs text-blue-700 space-y-1.5 leading-relaxed font-medium">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                Read the question on the <strong>front</strong> of the card.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                Click or tap the card to <strong>flip</strong> and see the
                answer on the back.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                Review each card at your own pace to improve your long-term
                memory.
              </li>
            </ul>
          </div>
        </div>
        {/* 5. Action Button */}
        <div className="flex justify-center mt-4">
          <a
            href={`/course/${course_id}/flashcard/${deck_id}/start_flashcard`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl transition-all flex items-center gap-3 shadow-lg shadow-blue-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
            Start
          </a>
        </div>
      </section>
    </div>
  );
}
