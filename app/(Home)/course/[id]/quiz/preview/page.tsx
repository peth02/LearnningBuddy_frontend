"use client";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Quiz2,
  Question,
  PreviewQuizResponse,
  QuizMetaData,
  Course,
  Choice,
} from "@/types/Course";
import { CourseQuestionsPreviewNav } from "@/components/Navbar";
import { createQuizFromPreview, getQuizPreviewByJobId } from "@/services/quiz";
import { getCourseByID } from "@/services/course";
import Alert from "@/components/Aleart";

export default function PreviewQuiz() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const course_id = params.id;
  const job_id = searchParams.get("job") || null;

  const [alertBox, setAlertBox] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [course, setCourse] = useState<Course>();
  const [loadingData, setLoadingData] = useState<PreviewQuizResponse>({
    job_id: job_id || "",
    status: "QUEUED",
    progress_percent: 0,
  });
  const [quizMetaData, setQuizMetaData] = useState<QuizMetaData>({
    title: `Quiz ${job_id ? job_id.slice(0, 10) : ""}`,
    solution_visibility: "ALWAYS",
    is_published: true,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editQuestions, setEditQuestions] = useState<Question[]>([]);

  const currentQIndex = parseInt(searchParams.get("q") || "1") - 1;
  const currentQuestion = editQuestions[currentQIndex];

  // 1. สร้างฟังก์ชันสำหรับจัดการการเปลี่ยนแปลง
  const handleMetaChange = (
    field: keyof QuizMetaData,
    value: string | boolean,
  ) => {
    setQuizMetaData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 1. ฟังก์ชันสำหรับเพิ่มคำถามใหม่
  const handleAddQuestion = () => {
    // กำหนดค่าเริ่มต้นสำหรับคำถามใหม่
    const newQ: Question = {
      topic_id: course?.topics?.[0].topicId || "",
      question_text: "New Question",
      question_type: "NORMAL_MULTIPLE",
      difficulty: "EASY",
      explanation: "",
      choices: [
        { choice_text: "First Option", is_correct: true },
        { choice_text: "Second Option", is_correct: false },
      ],
    };

    // อัปเดต State โดยการกระจายอาเรย์เดิมและเพิ่มตัวใหม่ (Immutable Update)
    const updatedQuestions = [...editQuestions, newQ];
    setEditQuestions(updatedQuestions);

    // ย้ายไปที่ข้อคำถามใหม่ล่าสุดทันทีผ่าน URL
    const nextIndex = updatedQuestions.length;
    router.push(`?job=${job_id}&q=${nextIndex}`, { scroll: false });
  };
  // --- Handlers สำหรับแก้ไขคำถามภายใน Quiz ---
  const handleQuestionUpdate = (field: keyof Question, value: any) => {
    // 1. สร้าง Array ใหม่จาก editQuestions ปัจจุบัน
    const updatedQuestions = [...editQuestions];
    updatedQuestions[currentQIndex] = {
      ...updatedQuestions[currentQIndex],
      [field]: value,
    };

    // 2. อัปเดต editQuestions เพื่อให้ UI เปลี่ยนแปลงทันที
    setEditQuestions(updatedQuestions);

    // 3. อัปเดต editQuiz ให้สอดคล้องกัน (เผื่อใช้ส่ง API)
    // setEditQuiz((prev) =>
    //   prev ? { ...prev, questions: updatedQuestions } : prev,
    // );
  };
  const handleAddChoice = () => {
    const newChoice: Choice = {
      choice_text: "",
      is_correct: false,
    };
    const updatedChoices = [...(currentQuestion?.choices || []), newChoice];
    handleQuestionUpdate("choices", updatedChoices);
  };
  // --- Handlers สำหรับ Choices ---
  const handleChoiceUpdate = (
    choiceIndex: number,
    field: keyof Choice,
    value: any,
  ) => {
    // ใช้ข้อมูลจาก editQuestions เป็นหลัก
    const updatedChoices = [...(editQuestions[currentQIndex]?.choices || [])];

    if (field === "is_correct") {
      updatedChoices.forEach((c, i) => (c.is_correct = i === choiceIndex));
    } else {
      updatedChoices[choiceIndex] = {
        ...updatedChoices[choiceIndex],
        [field]: value,
      };
    }

    handleQuestionUpdate("choices", updatedChoices);
  };
  const handleRemoveChoice = (choiceIndex: number) => {
    if ((currentQuestion?.choices?.length || 0) <= 2) {
      alert("A question must have at least 2 choices.");
      return;
    }
    const updatedChoices = currentQuestion?.choices.filter(
      (_, i) => i !== choiceIndex,
    );
    handleQuestionUpdate("choices", updatedChoices);
  };
  // 2. ฟังก์ชันสำหรับลบคำถาม
  const handleDeleteQuestion = (indexToDelete: number) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    // กรองเอาเฉพาะข้อที่ไม่ต้องการลบออก
    const updatedQuestions = editQuestions.filter(
      (_, i) => i !== indexToDelete,
    );

    setEditQuestions(updatedQuestions);

    // คำนวณ Navigation หลังลบ
    const activeIdxFromUrl = parseInt(searchParams.get("q") || "1");

    // หากข้อที่ถูกลบคือข้อปัจจุบันที่กำลังดูอยู่ หรือเป็นข้อสุดท้าย
    if (activeIdxFromUrl > updatedQuestions.length) {
      const targetIdx = Math.max(1, updatedQuestions.length);
      router.push(`?job=${job_id}&q=${targetIdx}`, { scroll: false });
    }
  };

  const handleCancel = () => {
    setEditQuestions(questions);
    setQuizMetaData({
      title: `Quiz ${job_id ? job_id.slice(0, 10) : ""}`,
      solution_visibility: "ALWAYS",
      is_published: true,
    });
    router.push(`?job=${job_id}&q=1`, { scroll: false });
  };

  const handleSubmit = async () => {
    try {
      const res: any = await createQuizFromPreview(
        course_id,
        quizMetaData,
        editQuestions,
      );
      if (res.success) {
        setAlertBox({ message: res.message, type: "success" });
        // const creaeted_id = res.data.quiz_id;
        setTimeout(() => router.push(`/course/${course_id}`), 5000);
      } else {
        setAlertBox({
          message: res.message || "Create quiz failed",
          type: "error",
        });
      }
    } catch (error) {
      setAlertBox({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };
  useEffect(() => {
    if (!job_id) return;
    const checkProgress = setInterval(async () => {
      try {
        const res = await getQuizPreviewByJobId(job_id);
        setLoadingData(res);

        if (res.progress_percent === 100) {
          clearInterval(checkProgress);
          setQuestions(res.result.generated_questions);
          setEditQuestions(res.result.generated_questions);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 20000); // 20 seconde

    return () => clearInterval(checkProgress);
  }, [job_id]);

  useEffect(() => {
    if (!course_id) return;
    const getCourse = async () => {
      try {
        const res = await getCourseByID(course_id);
        if (res) {
          setCourse(res);
          // console.log("Course loaded successfully:", res);
        }
      } catch (error) {
        console.error("Fetch course error:", error);
      }
    };

    getCourse();
  }, []);

  // 1. หน้าจอ Loading (เมื่อ progress < 100)
  if (loadingData.progress_percent < 100 && loadingData.status != "FAILED") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-20 py-10">
        <div className="bg-gray-100 flex flex-col items-center justify-center p-10">
          <div className="max-w-lg w-full text-center bg-white p-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in zoom-in duration-500">
            <div className="mb-8 flex justify-center">
              {/* <div className="relative">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.394l-1.154.908a2 2 0 01-3.147-1.458V5.272a2 2 0 011.242-1.844l6.162-2.465a4 4 0 012.592 0l6.162 2.465a2 2 0 011.242 1.844v9.612a2 2 0 01-1.108 1.782l-1.154.577z"
                    />
                  </svg>
                </div>
              </div> */}
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Generating Your Quiz
            </h2>
            <p className="text-gray-500 mb-10 text-lg">
              Our AI is crafting custom questions based on your topics.
              <br />
              {/* <span className="text-sm italic text-gray-400">
                This usually takes less than a minute.
              </span> */}
            </p>

            {/* Progress Bar Container */}
            <div className="relative pt-1">
              <div className="flex justify-center mb-3 items-center justify-between">
                <div className="text-right">
                  <span className="text-sm font-bold inline-block text-blue-600 font-mono">
                    {loadingData.progress_percent}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner">
                <div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-700 ease-in-out relative overflow-hidden"
                  style={{ width: `${loadingData.progress_percent}%` }}
                >
                  {/* เพิ่มแสงเงาวิ่งผ่าน ProgressBar (Shimmer Effect) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
              <div
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
              <span className="text-sm font-medium ml-2">
                AI is thinking...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loadingData.status === "FAILED") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-10">
        <div className="max-w-md w-full text-center bg-white p-12 rounded-3xl shadow-lg border border-red-100 animate-in fade-in zoom-in duration-300">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Generation Failed
          </h2>
          <p className="text-gray-500 mb-8">
            Something went wrong while creating your quiz. Please try again or
            check your topics.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-white text-gray-600 font-semibold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* 🔔 Floating Alert System (Style 1) */}
      <div className="fixed top-10 right-10 z-[100] flex flex-col gap-4">
        {alertBox && (
          <Alert
            message={alertBox.message}
            type={alertBox.type}
            onClose={() => setAlertBox(null)}
          />
        )}
      </div>
      <div className="px-20 py-10">
        <section className="bg-white rounded-lg shadow-sm p-10 flex flex-col gap-5">
          <button
            onClick={() => router.push(`/course/${course_id}`)}
            className="mr-auto text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm font-semibold transition cursor-pointer"
          >
            ← Back to Course
          </button>
          <div>
            <label className="block font-semibold mb-3 text-gray-800">
              Quiz Title
            </label>
            <input
              name="title"
              type="text"
              required
              value={quizMetaData.title}
              onChange={(e) => handleMetaChange("title", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-3 text-gray-800">
              Solution Visibility
            </label>
            <select
              name="visibility"
              value={quizMetaData.solution_visibility}
              onChange={(e) =>
                handleMetaChange("solution_visibility", e.target.value)
              }
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALWAYS">ALWAYS (Show solutions after quiz)</option>
              <option value="NEVER">NEVER (Hide solutions)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              name="isPublic"
              type="checkbox"
              // ✅ ใช้ checked แทน defaultChecked สำหรับ controlled component
              checked={quizMetaData.is_published}
              onChange={(e) =>
                handleMetaChange("is_published", e.target.checked)
              }
              className="rounded border-gray-300 accent-blue-600 w-4 h-4"
            />
            <span className="text-gray-800">Publish this quiz</span>
          </label>
        </section>
        <section className="flex flex-1 mt-10 gap-10">
          <nav className="flex flex-col h-fit mx-auto bg-white rounded-lg shadow-sm py-10 px-5 max-h-200 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <h3 className="font-semibold w-[200px]">Questions</h3>
            {job_id &&
              editQuestions?.map((question, index) => (
                <CourseQuestionsPreviewNav
                  key={index}
                  index={(index + 1).toString()}
                  label={`question ${index + 1}`}
                  showDelete={true}
                  onDelete={() => handleDeleteQuestion(index)}
                  jobId={job_id}
                />
              ))}

            <button
              className="bg-blue-500 text-white font-bold px-4 py-2.5 max-w-[200] rounded-lg text-center cursor-pointer"
              onClick={handleAddQuestion}
            >
              + Add quiz
            </button>
          </nav>
          <div className="w-full bg-white rounded-lg shadow-sm p-10">
            <>
              <div className="block font-semibold mb-3 text-gray-800">
                Edit Question {currentQIndex + 1}
              </div>
              <div>
                <label className="block font-semibold mb-3 text-gray-800">
                  Question
                </label>
                <textarea
                  value={currentQuestion?.question_text}
                  onChange={(e) =>
                    handleQuestionUpdate("question_text", e.target.value)
                  }
                  placeholder="Enter your question here..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y"
                />
              </div>
              <div className="mb-6">
                <label className="block font-semibold mb-3 text-gray-800">
                  Topic
                </label>
                <select
                  // ผูกค่ากับ topic_id ของคำถามปัจจุบัน
                  value={currentQuestion?.topic_id}
                  onChange={(e) =>
                    handleQuestionUpdate("topic_id", e.target.value)
                  }
                  className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>
                    -- Select a Topic --
                  </option>

                  {/* วนลูปแสดงผล Topic จากข้อมูล Course */}
                  {course?.topics?.map((topic: any) => (
                    <option key={topic.topicId} value={topic.topicId}>
                      {topic.title}
                    </option>
                  ))}
                </select>

                {!course?.topics && (
                  <p className="mt-2 text-xs text-amber-600">
                    * No topics found in this course. Please add topics first.
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block font-semibold mb-3 text-gray-800">
                  Question Type
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      value: "NORMAL_MULTIPLE",
                      label: "Multiple Choice",
                      desc: "Select one correct answer",
                    },
                    {
                      value: "STATEMENT_VERIFICATION",
                      label: "Statement Verification",
                      desc: "True or False verification",
                    },
                    {
                      value: "STATEMENT_COUNTING",
                      label: "Statement Counting",
                      desc: "Count the number of correct statements",
                    },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        currentQuestion?.question_type === item.value
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="question_type"
                        value={item.value}
                        checked={currentQuestion?.question_type === item.value}
                        onChange={(e) =>
                          handleQuestionUpdate("question_type", e.target.value)
                        }
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500 accent-blue-600"
                      />
                      <div className="ml-4">
                        <p
                          className={`font-bold ${currentQuestion?.question_type === item.value ? "text-blue-700" : "text-gray-700"}`}
                        >
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 italic">
                          {item.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block font-semibold mb-3 text-gray-800">
                  Difficulty Level
                </label>
                <div className="flex gap-4">
                  {[
                    {
                      value: "EASY",
                      label: "Easy",
                      color: "bg-green-500",
                      borderColor: "border-green-500",
                      textColor: "text-green-700",
                      bgColor: "bg-green-50",
                    },
                    {
                      value: "MEDIUM",
                      label: "Medium",
                      color: "bg-amber-500",
                      borderColor: "border-amber-500",
                      textColor: "text-amber-700",
                      bgColor: "bg-amber-50",
                    },
                    {
                      value: "HARD",
                      label: "Hard",
                      color: "bg-red-500",
                      borderColor: "border-red-500",
                      textColor: "text-red-700",
                      bgColor: "bg-red-50",
                    },
                  ].map((level) => (
                    <label
                      key={level.value}
                      className={`flex-1 flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        currentQuestion?.difficulty === level.value
                          ? `${level.borderColor} ${level.bgColor} ${level.textColor}`
                          : "border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={level.value}
                        checked={currentQuestion?.difficulty === level.value}
                        onChange={(e) =>
                          handleQuestionUpdate("difficulty", e.target.value)
                        }
                        className="hidden" // ซ่อน input จริงไว้เพื่อให้แสดงผลแบบ Button Group
                      />
                      <span
                        className={`w-3 h-3 rounded-full mb-2 ${level.color}`}
                      ></span>
                      <span className="text-sm font-bold uppercase">
                        {level.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block font-semibold text-gray-800">
                    Answer Choices
                  </label>
                  <span className="text-xs text-gray-500 italic">
                    Select one correct answer
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {currentQuestion?.choices?.map((choice, index) => (
                    <div
                      key={choice.id || index}
                      className="flex flex-col gap-2 p-4 border-2 border-gray-50 rounded-2xl bg-gray-50/30 group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Blue Dot Radio Button */}
                        <button
                          type="button"
                          onClick={() =>
                            handleChoiceUpdate(index, "is_correct", true)
                          }
                          className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                            choice.is_correct
                              ? "border-blue-500 bg-white"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {choice.is_correct && (
                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-in zoom-in duration-200" />
                          )}
                        </button>

                        {/* Choice Text Input */}
                        <input
                          type="text"
                          value={choice.choice_text}
                          onChange={(e) =>
                            handleChoiceUpdate(
                              index,
                              "choice_text",
                              e.target.value,
                            )
                          }
                          placeholder={`Choice ${index + 1}`}
                          className={`flex-1 p-3 border-2 rounded-xl outline-none transition-all ${
                            choice.is_correct
                              ? "border-blue-200 bg-white"
                              : "border-transparent bg-white focus:border-blue-400"
                          }`}
                        />

                        {/* Delete Choice Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveChoice(index)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>

                      {/* ✅ Choice Explanation Input */}
                      <div className="ml-9">
                        <textarea
                          value={choice.explanation || ""}
                          onChange={(e) =>
                            handleChoiceUpdate(
                              index,
                              "explanation",
                              e.target.value,
                            )
                          }
                          placeholder="Add explanation for this specific choice (optional)..."
                          className="w-full p-3 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-400 outline-none transition-all resize-none bg-white/50 focus:bg-white"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddChoice}
                    className="flex items-center gap-2 text-blue-500 font-semibold text-sm mt-2 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors w-fit"
                  >
                    <span className="text-xl">+</span> Add Choice
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-3 text-gray-800">
                  Explanation
                </label>
                <textarea
                  value={currentQuestion?.explanation || ""}
                  onChange={(e) =>
                    handleQuestionUpdate("explanation", e.target.value)
                  }
                  placeholder="Enter your explanation here..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y"
                />
              </div>
            </>
          </div>
        </section>
      </div>
      <div className="mt-auto flex justify-end items-center px-20 py-5 gap-10 bg-white">
        <div>Create Quiz?</div>
        {/* <button
          className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 cursor-pointer"
          onClick={handleCancel}
        >
          Cancle
        </button> */}
        <button
          className="bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-center cursor-pointer"
          onClick={handleSubmit}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
