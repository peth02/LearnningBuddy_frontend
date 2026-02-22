"use client";

import { getCourseByID } from "@/services/course";
import { getQuizByQuizId } from "@/services/quiz";
import { Course, Quiz2 } from "@/types/Course";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Quiz() {
  const [course, setCourse] = useState<Course>();
  const [quiz, setQuiz] = useState<Quiz2>();

  // 1. เพิ่ม State สำหรับควบคุมการเปิด-ปิด (ไว้ที่ส่วนบนของ Component)
  const [showTopics, setShowTopics] = useState(false);

  const router = useRouter();
  const params = useParams();

  const quiz_id = params.quizId;
  const course_id = params.id;

  {
    /* คำนวณจำนวนข้อแยกตามระดับความยาก */
  }
  const difficultyCounts = quiz?.questions?.reduce(
    (acc, q) => {
      const diff = q.difficulty?.toUpperCase();
      if (diff === "EASY") acc.easy++;
      else if (diff === "MEDIUM") acc.medium++;
      else if (diff === "HARD") acc.hard++;
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 },
  ) || { easy: 0, medium: 0, hard: 0 };

  // 1. หา Unique Topic IDs จากคำถามทั้งหมดที่มีใน Quiz
  const uniqueTopicIds = Array.from(
    new Set(quiz?.questions?.map((q) => q.topic_id?.toString())),
  );

  // 2. Map Topic IDs ไปเป็นข้อมูลรายละเอียดจาก Course
  const topicsInQuiz = uniqueTopicIds
    .map((id) => {
      // ค้นหาหัวข้อที่มี topicId ตรงกันในข้อมูล Course
      return course?.topics?.find((t: any) => t.topicId.toString() === id);
    })
    .filter(Boolean); // กรองค่าที่เป็น undefined ออกกรณีหาไม่เจอ

  const handleStartQuiz = async () => {};
  useEffect(() => {
    if (!quiz_id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response1 = await getCourseByID(course_id);
        console.log("Data1 loaded:", response1);
        setCourse(response1);

        const response2 = await getQuizByQuizId(quiz_id);
        console.log("Data2 loaded:", response2);
        setQuiz(response2);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [quiz_id]);

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
            {quiz?.title || "Quiz Title"}
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
                {quiz?.questions?.length || 0}
              </p>
            </div>
          </div>

          {/* Difficulty Badges */}
          <div className="bg-gray-100 p-6 rounded-xl flex flex-col justify-center gap-2">
            <p className="text-xs text-gray-500 font-semibold uppercase">
              Difficulty
            </p>
            <div className="flex gap-2">
              {difficultyCounts.easy > 0 && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200">
                  {difficultyCounts.easy} Easy
                </span>
              )}
              {difficultyCounts.medium > 0 && (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded border border-yellow-200">
                  {difficultyCounts.medium} Medium
                </span>
              )}
              {difficultyCounts.hard > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200">
                  {difficultyCounts.hard} Hard
                </span>
              )}
              {/* กรณีไม่มีคำถามเลย */}
              {quiz?.questions?.length === 0 && (
                <span className="text-[10px] text-gray-400 italic">
                  No questions yet
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Topics in this quiz section */}
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
              Topics in this quiz
              <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {topicsInQuiz.length}
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
            {topicsInQuiz.length > 0 ? (
              topicsInQuiz.map((topic, index) => (
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
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-blue-900">Quiz Instructions</h3>
            <p className="text-sm text-blue-700/80 leading-relaxed">
              Read each question carefully. Select the best answer(s) and
              submit. You'll see your results at the end.
            </p>
          </div>
        </div>
        {/* 5. Action Button */}
        <div className="flex justify-center mt-4">
          <a href={`/course/${course_id}/quiz/${quiz_id}/start_quiz`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-xl transition-all flex items-center gap-3 shadow-lg shadow-blue-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
            Take Quiz
          </a>
          
        </div>
      </section>
    </div>
  );
}
