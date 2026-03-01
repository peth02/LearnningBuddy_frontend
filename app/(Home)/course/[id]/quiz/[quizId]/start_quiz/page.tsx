"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Choice2, Question2, Quiz3, QuizResult } from "@/types/Course";
import { getStartQuizById, submitQuizAttempt } from "@/services/quiz";

export default function StartQuiz() {
  const [quiz, setQuiz] = useState<Quiz3>();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  // ✅ เก็บเป็นออบเจกต์ { question_id, choice_id } ตามที่ API ต้องการ
  const [answers, setAnswers] = useState<
    { question_id: string; choice_id: string }[]
  >([]);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState<any>(null);
  // เพิ่ม State สำหรับควบคุมการเปิด/ปิดเฉลย
  const [showFeedback, setShowFeedback] = useState(false);
  const router = useRouter();
  const params = useParams();

  const quiz_id = params.quizId;
  const course_id = params.id;

  useEffect(() => {
    if (!quiz_id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response1 = await getStartQuizById(quiz_id);
        // console.log("Data1 loaded:", response1);
        setQuiz(response1);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const currentQuestion = quiz?.questions[currentStep];
  const isLastQuestion =
    currentStep === (quiz?.questions ? quiz.questions.length - 1 : 0);

  const handleNext = () => {
    if (selectedChoiceId === null || !currentQuestion?.id) return;

    const newAnswer = {
      question_id: currentQuestion.id,
      choice_id: selectedChoiceId,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      submitQuiz(updatedAnswers);
    } else {
      setCurrentStep((prev) => prev + 1);
      setSelectedChoiceId(null);
    }
  };

  const submitQuiz = async (
    finalAnswers: { question_id: string; choice_id: string }[],
  ) => {
    if (!quiz?.quiz_id) return;

    try {
      // 1. ส่งคำตอบไปยัง API และรับ Feedback (QuizResult) กลับมา
      const resultData: QuizResult = await submitQuizAttempt(
        quiz.quiz_id,
        finalAnswers,
      );

      // console.log("Quiz Result Received:", resultData);

      // 2. คำนวณเปอร์เซ็นต์คะแนน
      const scorePercentage = Math.round(
        (resultData.total_score / resultData.max_score) * 100,
      );

      // 3. อัปเดต State เพื่อแสดงหน้าสรุปผล (image_0602bd.png)
      setResults({
        score: scorePercentage,
        correct: resultData.total_score,
        incorrect: resultData.max_score - resultData.total_score,
        total: resultData.max_score,
        feedback: resultData.feedback, // เก็บไว้ใช้แสดงเฉลยในอนาคต
        start_time: resultData.start_time,
        end_time: resultData.end_time,
      });

      setIsFinished(true);
    } catch (error: any) {
      console.error("Failed to submit quiz:", error.message);
    }
  };

  const difficultyStyles = {
    EASY: "bg-green-100 text-green-700 border-green-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
    HARD: "bg-red-100 text-red-700 border-red-200",
  };

  if (!quiz) return <div className="p-20 text-center">Loading Quiz...</div>;

  if (isFinished && results) {
    const formatTimeSpent = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const diffInSeconds = Math.floor(
        (endDate.getTime() - startDate.getTime()) / 1000,
      );

      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor((diffInSeconds % 3600) / 60);
      const seconds = diffInSeconds % 60;

      return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");
    };
    const timeSpent = formatTimeSpent(results.start_time, results.end_time);
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 p-10 gap-6">
        <div className="bg-white rounded-3xl shadow-sm p-12 max-w-lg w-full text-center flex flex-col items-center">
          {/* Trophy Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🏆</span>
          </div>

          <h2 className="text-gray-500 font-bold uppercase text-sm tracking-widest">
            Quiz Complete!
          </h2>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {quiz?.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-8 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Time Spent:{" "}
            <span className="text-gray-700 font-mono">{timeSpent}</span>
          </div>
          <div className="text-6xl font-black text-blue-900 my-6">
            {results.score}%
          </div>
          <p className="text-gray-500 font-medium mb-8">
            You got {results.correct} out of {results.total} questions correct
          </p>

          {/* Progress Bar (image_0602bd.png style) */}
          <div className="w-full bg-gray-100 h-3 rounded-full mb-8 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${results.score >= 50 ? "bg-blue-600" : "bg-orange-500"}`}
              style={{ width: `${results.score}%` }}
            ></div>
          </div>

          {/* Correct/Incorrect Stats (image_0602bd.png style) */}
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="border border-green-100 bg-green-50/50 p-4 rounded-2xl flex flex-col items-center">
              <div className="flex items-center gap-2 text-green-600 text-sm font-bold mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Correct
              </div>
              <p className="text-3xl font-black text-green-700">
                {results.correct}
              </p>
            </div>
            <div className="border border-red-100 bg-red-50/50 p-4 rounded-2xl flex flex-col items-center">
              <div className="flex items-center gap-2 text-red-600 text-sm font-bold mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Incorrect
              </div>
              <p className="text-3xl font-black text-red-700">
                {results.incorrect}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full mb-6">
            <button
              onClick={() => router.push(`/course/${course_id}`)}
              className="flex-1 py-3.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              Back to Course
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
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
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Retake Quiz
            </button>
          </div>

          {/* 📘 Solution / Feedback Dropdown (Condition: ALWAYS) */}
          {quiz.solution_visibility === "ALWAYS" && results.feedback && (
            <div className="w-full border-t border-gray-100 pt-6">
              <button
                onClick={() => setShowFeedback(!showFeedback)}
                className="flex items-center justify-center gap-2 text-blue-600 font-bold hover:underline w-full"
              >
                {showFeedback ? "Hide Solutions" : "Review Solutions"}
                <svg
                  className={`transition-transform ${showFeedback ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Expanded Feedback List */}
        {showFeedback && quiz.solution_visibility === "ALWAYS" && (
          <div className="max-w-2xl w-full flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <h4 className="font-bold text-gray-700 px-2">Solutions Review</h4>
            {results.feedback.map((item: any, idx: number) => (
              <div
                key={item.question_id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${item.is_correct ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {item.is_correct ? "Correct" : "Incorrect"}
                  </span>
                  <span className="text-gray-400 font-bold text-xs">
                    Question {idx + 1}
                  </span>
                </div>
                <p className="font-bold text-gray-800 mb-4">
                  {item.question_text}
                </p>
                {/* 📋 ส่วนแสดงผล Choices แบบ Inline พร้อมคำอธิบายแยกรายข้อ */}
                <div className="flex flex-col gap-3 mb-6">
                  {item.choices.map((choice: any, index: number) => {
                    const isUserSelected = item.user_choice_ids.includes(
                      choice.id,
                    );
                    const isCorrect = item.correct_choice_ids.includes(
                      choice.id,
                    );

                    return (
                      <div key={choice.id} className="flex flex-col gap-2">
                        <div
                          className={`flex items-center gap-3 p-4 border-2 rounded-xl transition-all ${
                            isUserSelected && !isCorrect
                              ? "border-red-500 bg-red-50/30"
                              : isCorrect
                                ? "border-green-500 bg-green-50/30"
                                : "border-gray-100"
                          }`}
                        >
                          {/* Indicator Dot (Blue Dot Style) */}
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                              isCorrect
                                ? "border-green-500"
                                : isUserSelected
                                  ? "border-red-500"
                                  : "border-gray-300"
                            }`}
                          >
                            {(isUserSelected || isCorrect) && (
                              <div
                                className={`w-2.5 h-2.5 rounded-full animate-in zoom-in duration-300 ${
                                  isCorrect ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                            )}
                          </div>

                          <div className="flex-1 flex justify-between items-center">
                            <span
                              className={`text-sm font-medium ${
                                isCorrect
                                  ? "text-green-800 font-bold"
                                  : isUserSelected
                                    ? "text-red-800"
                                    : "text-gray-700"
                              }`}
                            >
                              {choice.choice_text}
                            </span>
                          </div>
                        </div>

                        {/* ✅ Choice-specific Explanation (แสดงเฉพาะเมื่อมีข้อมูล) */}
                        {choice.explanation && (
                          <div className="ml-8 px-4 py-2 border-l-2 border-blue-200">
                            <p className="text-sm text-gray-500 leading-relaxed italic">
                              Choice {index + 1} explanation.
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed italic">
                              {choice.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Overall Question Explanation Box */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                  <p className="text-xs font-bold text-blue-800 uppercase mb-1">
                    Overall Explanation
                  </p>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 py-10 px-20 gap-6">
      {/* Header & Progress Bar */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-gray-800">{quiz.title}</h1>
        </div>
        <p className="text-xs font-bold text-gray-400 mb-2">
          Progress: {currentStep}/{quiz.questions.length}
        </p>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500"
            style={{ width: `${(currentStep / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-sm p-10 flex flex-col gap-8 flex-1">
        <div className="flex gap-2">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${
              difficultyStyles[
                currentQuestion?.difficulty as keyof typeof difficultyStyles
              ] || "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {currentQuestion?.difficulty}
          </span>
        </div>

        <div>
          <h2 className="text-gray-400 font-bold mb-2">
            Question {currentStep + 1}
          </h2>
          <h3 className="text-xl font-bold text-gray-800 leading-relaxed">
            {currentQuestion?.question_text}
          </h3>
        </div>

        {/* Choices List */}
        <div className="flex flex-col gap-4">
          {currentQuestion?.choices.map((choice) => (
            <label
              key={choice.id}
              className={`flex items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                selectedChoiceId === choice.id
                  ? "border-blue-500 bg-blue-50/50 shadow-sm"
                  : "border-gray-100 hover:border-blue-200"
              }`}
            >
              <input
                type="radio"
                name="quiz-choice"
                className="hidden"
                checked={selectedChoiceId === choice.id}
                onChange={() => setSelectedChoiceId(choice.id)}
              />
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all ${
                  selectedChoiceId === choice.id
                    ? "border-blue-500 bg-white"
                    : "border-gray-300"
                }`}
              >
                {selectedChoiceId === choice.id && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <span
                className={`font-medium ${selectedChoiceId === choice.id ? "text-blue-700" : "text-gray-700"}`}
              >
                {choice.choice_text}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-auto pt-10">
          <button
            disabled={selectedChoiceId === null}
            onClick={handleNext}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedChoiceId !== null
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLastQuestion ? "Complete Quiz" : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
