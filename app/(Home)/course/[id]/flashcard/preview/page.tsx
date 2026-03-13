"use client";
import Alert from "@/components/Aleart";
import { CourseFlashcardsPreviewNav } from "@/components/Navbar";
import { getCourseByID } from "@/services/course";
import {
  createFlashcardFromPreview,
  getFlashcardPreviewByJobId,
} from "@/services/flashcard";
import {
  Course,
  DeckMetaData,
  Flashcard,
  PreviewDeckResponse,
} from "@/types/Course";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviewDeck() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const course_id = params.id;
  const job_id = searchParams.get("job") || null;

  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [course, setCourse] = useState<Course>();
  const [loadingData, setLoadingData] = useState<PreviewDeckResponse>({
    job_id: job_id || "",
    course_id: "",
    course_title: "",
    status: "QUEUED",
    progress_percent: 0,
  });
  const [deckMetaData, setDeckMetaData] = useState<DeckMetaData>({
    title: `Deck ${job_id ? job_id.slice(0, 10) : ""}`,
    is_published: true,
  });
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [editFlashcards, setEditFlashcards] = useState<Flashcard[]>([]);

  const currentCIndex = parseInt(searchParams.get("c") || "1") - 1;
  const currentCard = editFlashcards[currentCIndex];

  // 1. สร้างฟังก์ชันสำหรับจัดการการเปลี่ยนแปลง
  const handleMetaChange = (
    field: keyof DeckMetaData,
    value: string | boolean,
  ) => {
    setDeckMetaData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddCard = () => {
    // กำหนดค่าเริ่มต้นสำหรับคำถามใหม่
    const newC: Flashcard = {
      topic_id: course?.topics?.[0].topicId || "",
      front_text: "front text",
      back_text: "back text",
    };

    // อัปเดต State โดยการกระจายอาเรย์เดิมและเพิ่มตัวใหม่ (Immutable Update)
    const updatedCards = [...editFlashcards, newC];
    setEditFlashcards(updatedCards);

    // ย้ายไปที่ข้อคำถามใหม่ล่าสุดทันทีผ่าน URL
    const nextIndex = updatedCards.length;
    router.push(`?job=${job_id}&c=${nextIndex}`, { scroll: false });
  };

  const handleCardUpdate = (field: keyof Flashcard, value: any) => {
    // 1. สร้าง Array ใหม่จาก editQuestions ปัจจุบัน
    const updatedCards = [...editFlashcards];
    updatedCards[currentCIndex] = {
      ...updatedCards[currentCIndex],
      [field]: value,
    };

    // 2. อัปเดต editQuestions เพื่อให้ UI เปลี่ยนแปลงทันที
    setEditFlashcards(updatedCards);

    // 3. อัปเดต editQuiz ให้สอดคล้องกัน (เผื่อใช้ส่ง API)
    // setEditQuiz((prev) =>
    //   prev ? { ...prev, questions: updatedCards } : prev,
    // );
  };

  const handleDeleteCard = (indexToDelete: number) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;

    // กรองเอาเฉพาะข้อที่ไม่ต้องการลบออก
    const updatedCards = editFlashcards.filter((_, i) => i !== indexToDelete);

    setEditFlashcards(updatedCards);

    // คำนวณ Navigation หลังลบ
    const activeIdxFromUrl = parseInt(searchParams.get("q") || "1");

    // หากข้อที่ถูกลบคือข้อปัจจุบันที่กำลังดูอยู่ หรือเป็นข้อสุดท้าย
    if (activeIdxFromUrl > updatedCards.length) {
      const targetIdx = Math.max(1, updatedCards.length);
      router.push(`?job=${job_id}&q=${targetIdx}`, { scroll: false });
    }
  };

  const handleSubmit = async () => {
    try {
      const res: any = await createFlashcardFromPreview(
        course_id,
        deckMetaData,
        editFlashcards,
      );
      if (res.success) {
        setAlert({ message: res.message, type: "success" });
        //   const creaeted_id = res.data.quiz_id;
        setTimeout(() => router.push(`/course/${course_id}`), 5000);
      } else {
        setAlert({
          message: res.message || "Create deck failed",
          type: "error",
        });
      }
    } catch (error) {
      setAlert({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!job_id) return;
    const checkProgress = setInterval(async () => {
      try {
        const res = await getFlashcardPreviewByJobId(job_id);
        setLoadingData(res);

        if (res.progress_percent === 100) {
          clearInterval(checkProgress);
          setFlashcards(res.result.generated_cards);
          setEditFlashcards(res.result.generated_cards);
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
              Generating Your Deck
            </h2>
            <p className="text-gray-500 mb-10 text-lg">
              Our AI is crafting custom cards based on your topics.
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
            Something went wrong while creating your deck. Please try again or
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
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
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
              value={deckMetaData.title}
              onChange={(e) => handleMetaChange("title", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              name="isPublic"
              type="checkbox"
              // ✅ ใช้ checked แทน defaultChecked สำหรับ controlled component
              checked={deckMetaData.is_published}
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
            <h3 className="font-semibold w-[200px]">Flahcards</h3>
            {job_id &&
              editFlashcards?.map((card, index) => (
                <CourseFlashcardsPreviewNav
                  key={index}
                  index={(index + 1).toString()}
                  label={`flashcard ${index + 1}`}
                  showDelete={true}
                  onDelete={() => handleDeleteCard(index)}
                  jobId={job_id}
                />
              ))}
            <button
              className="bg-blue-500 text-white font-bold px-4 py-2.5 max-w-[200] rounded-lg text-center cursor-pointer"
              onClick={handleAddCard}
            >
              + Add quiz
            </button>
          </nav>
          <div className="w-full bg-white rounded-lg shadow-sm p-10">
            <>
              <div className="block font-semibold mb-3 text-gray-800">
                Edit Flashcard {currentCIndex + 1}
              </div>
              <div className="mb-6">
                <label className="block font-semibold mb-3 text-gray-800">
                  Topic
                </label>
                <select
                  // ผูกค่ากับ topic_id ของคำถามปัจจุบัน
                  value={currentCard?.topic_id}
                  onChange={(e) => handleCardUpdate("topic_id", e.target.value)}
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
              <div>
                <label className="block font-semibold mb-3 text-gray-800">
                  Front text
                </label>
                <textarea
                  value={currentCard?.front_text || ""}
                  onChange={(e) =>
                    handleCardUpdate("front_text", e.target.value)
                  }
                  placeholder="Enter your question here..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y"
                />
              </div>
              <div>
                <label className="block font-semibold mb-3 text-gray-800">
                  Back text
                </label>
                <textarea
                  value={currentCard?.back_text || ""}
                  onChange={(e) =>
                    handleCardUpdate("back_text", e.target.value)
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
        <div>Create Deck?</div>
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
