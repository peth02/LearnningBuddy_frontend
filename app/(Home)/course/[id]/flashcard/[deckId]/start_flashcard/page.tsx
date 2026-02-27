"use client";

import { getCourseByID } from "@/services/course";
import { getDeckByDeckId } from "@/services/flashcard";
import { Course, FlashcardDeck2 } from "@/types/Course";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StartFlashcard() {
  const [course, setCourse] = useState<Course>();
  const [deck, setDeck] = useState<FlashcardDeck2>();
  // ✅ ใช้ stage เป็นตัวกำหนด Index ของการ์ด (เริ่มที่ 1)
  const [stage, setStage] = useState<number>(1);
  // ✅ State สำหรับควบคุมการพลิกการ์ด (Front/Back)
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const currentCard = deck?.cards[stage - 1];
  const currentTopicName =
    course?.topics?.find(
      (t: any) => t.topicId.toString() === currentCard?.topic_id?.toString(),
    )?.title || "General Topic";
  const totalCards = deck?.cards.length || 0;

  const router = useRouter();
  const params = useParams();

  const deck_id = params.deckId;
  const course_id = params.id;

  // ✅ ฟังก์ชันสำหรับเปลี่ยนหน้า
  const handleNext = () => {
    if (stage < totalCards) {
      setStage((prev) => prev + 1);
      setIsFlipped(false); // รีเซ็ตการพลิกเมื่อเปลี่ยนข้อ
    }
  };

  const handlePrev = () => {
    if (stage > 1) {
      setStage((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  useEffect(() => {
    if (!deck_id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response1 = await getCourseByID(course_id);
        console.log("Data1 loaded:", response1);
        setCourse(response1);

        const response2 = await getDeckByDeckId(deck_id);
        console.log("Data2 loaded:", response2);
        setDeck(response2);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [deck_id]);

  if (!deck)
    return (
      <div className="p-20 text-center text-gray-400">Loading Deck...</div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 py-10 px-20 gap-6">
      <section className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex grow-0 w-full">
          <div className="text-m text-wrap w-full">
            <button
              onClick={() => router.push(`/course/${course_id}`)}
              className="text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm font-semibold transition cursor-pointer"
            >
              ← Back to Course
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold uppercase break-all mr-20">
                  {deck?.title}
                </h2>
              </div>
            </div>

            <div className="mt-7 flex gap-10">
              <div>
                <h3 className="font-semibold text-sm text-gray-500 uppercase">
                  Total Questions:
                </h3>
                <div className="text-gray-800 font-medium">
                  {deck?.cards?.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 🔵 Flashcard Display Section */}
      <section className="bg-white rounded-2xl shadow-sm p-10 flex flex-col items-center gap-10 flex-1 border border-gray-100 min-h-[500px] justify-center">
        {/* Flashcard Container - คลิกเพื่อพลิก */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-2xl aspect-[16/9] perspective-1000 cursor-pointer group"
        >
          <div
            className={`relative w-full h-full transition-all duration-500 transform-style-3d`}
          >
            {!isFlipped ? (
              <div className="absolute inset-0 backface-hidden bg-white border-2 border-gray-100 rounded-3xl shadow-lg flex flex-col items-center justify-center p-12 text-center group-hover:border-blue-200 transition-colors">
                <span className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4">
                  Question
                </span>
                <h3 className="text-3xl font-bold text-gray-800 leading-tight">
                  {currentCard?.front_text}
                </h3>
                <p className="mt-8 text-gray-400 text-sm font-medium animate-pulse">
                  Click to reveal answer
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 backface-hidden bg-white border-2 border-gray-100 rounded-3xl shadow-lg flex flex-col items-center justify-center p-12 text-center group-hover:border-blue-200 transition-colors">
                <span className="text-xs font-black text-blue-500 uppercase tracking-widest mb-4">
                  Answer
                </span>
                <p className="text-xl text-blue-900 font-medium leading-relaxed">
                  {currentCard?.back_text}
                </p>
                <div className="mt-4 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">
                  Topic: {currentTopicName}
                </div>
                <p className="mt-8 text-gray-400 text-sm font-medium animate-pulse">
                  Click to show question
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 🟠 Navigation Controls */}
        <div className="w-full max-w-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={stage === 1}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all border cursor-pointer ${
                stage === 1
                  ? "text-gray-300 border-gray-100 cursor-not-allowed"
                  : "text-gray-600 border-gray-200 hover:bg-gray-50 active:scale-95"
              }`}
            >
              Previous
            </button>

            <span className="text-sm font-bold text-gray-500 font-mono">
              {stage} / {totalCards}
            </span>

            <button
              onClick={handleNext}
              disabled={stage === totalCards}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
                stage === totalCards
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95"
              }`}
            >
              Next{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 overflow-x-auto py-2">
            {Array.from({ length: totalCards }).map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 rounded-full h-1.5 ${
                  stage === i + 1 ? "w-8 bg-blue-600" : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
