"use client";

import { EditDeckMetaForm } from "@/components/Forms";
import { CourseFlashcardsNav, CourseQuestionsNav } from "@/components/Navbar";
import { getCourseByID } from "@/services/course";
import { getDeckByDeckId, updateCourseDeckById } from "@/services/flashcard";
import { Course, Flashcard, FlashcardDeck2 } from "@/types/Course";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditDeck() {
  const [course, setCourse] = useState<Course>();
  const [deck, setDeck] = useState<FlashcardDeck2>();
  const [editDeck, setEditDeck] = useState<FlashcardDeck2>();
  const [editCards, setEditCards] = useState<Flashcard[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditMeta, setIsEditMeta] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // ดึงลำดับคำถามปัจจุบันจาก URL
  const currentCIndex = parseInt(searchParams.get("c") || "1") - 1;
  const currentCard = editCards[currentCIndex];

  const deck_id = params.deckId;
  const course_id = params.id;

  const handleEdit = () => {
    setIsEditMeta((prev) => !prev);
  };

  const handleUpdateMeta = (field: keyof FlashcardDeck2, value: any) => {
    setDeck((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleFlashcardUpdate = (field: keyof Flashcard, value: any) => {
    setIsEdit(true);

    // 1. สร้าง Array ใหม่จาก editCards ปัจจุบัน
    const updatedCards = [...editCards];
    updatedCards[currentCIndex] = {
      ...updatedCards[currentCIndex],
      [field]: value,
    };

    // 2. อัปเดต editCards เพื่อให้ UI เปลี่ยนแปลงทันที
    setEditCards(updatedCards);

    // 3. อัปเดต editQuiz ให้สอดคล้องกัน (เผื่อใช้ส่ง API)
    setEditDeck((prev) => (prev ? { ...prev, cards: updatedCards } : prev));
  };

  const handleAddFlashcard = () => {
    setIsEdit(true);
    const newC: Flashcard = {
      topic_id: course?.topics?.[0]?.topicId?.toString() || "",
      front_text: "front text",
      back_text: "back text",
    };

    const updatedCards = [...editCards, newC];
    setEditCards(updatedCards);
    setEditDeck((prev) => (prev ? { ...prev, cards: updatedCards } : prev));

    const nextIndex = updatedCards.length;
    router.push(`?c=${nextIndex}`, { scroll: false });
  };

  const handleDeleteFlashcard = (indexToDelete: number) => {
    if (!window.confirm("Delete this question?")) return;
    setIsEdit(true);

    const updatedCards = editCards.filter((_, i) => i !== indexToDelete);

    setEditCards(updatedCards);
    setEditDeck((prev) => (prev ? { ...prev, cards: updatedCards } : prev));

    // Routing Logic
    const activeIdx = parseInt(searchParams.get("c") || "1");
    if (activeIdx > updatedCards.length) {
      router.push(`?c=${Math.max(1, updatedCards.length)}`, {
        scroll: false,
      });
    }
  };

  const handleUpdateSubmit = async () => {
    const res = await updateCourseDeckById(deck_id, editCards);
    if (res) {
      window.alert(res.message);
      setIsEdit(false);
      handleUpdateMeta("cards", editCards)
    }
  };

  const handleCancel = () => {
    if (window.confirm("Discard changes?")) {
      // 1. รีเซ็ตคำถามกลับไปเป็นค่าดั้งเดิมจาก API (ใช้ [] ป้องกัน error)
      const originalCards = deck?.cards || [];
      setEditDeck(deck);
      setEditCards(originalCards);
      setIsEdit(false);
      setIsEditMeta(false);
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
        setEditDeck(response2);
        setEditCards(response2.cards);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [deck_id]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="px-20 py-10">
        <section className="bg-white rounded-lg shadow-sm p-10">
          {!isEditMeta && deck ? (
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
                      {deck.title}
                    </h2>
                    {deck.is_published ? (
                      <div className="mt-2 text-green-500 bg-green-200 px-2 py-1 rounded-lg font-bold text-sm h-fit w-fit">
                        Public
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-500 bg-gray-200 px-2 py-1 rounded-lg font-bold text-sm h-fit w-fit">
                        Private
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsEditMeta(true)}
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
                    Edit Deck Info
                  </button>
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
          ) : isEditMeta && deck ? (
            <EditDeckMetaForm
              deck={deck}
              setDataForm={handleUpdateMeta}
              stateChange={handleEdit}
            />
          ) : null}
        </section>
        <section className="flex flex-1 mt-10 gap-10">
          <nav className="flex flex-col h-fit mx-auto bg-white rounded-lg shadow-sm py-10 px-5 max-h-200 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <h3 className="font-semibold w-[200px]">Flashcards</h3>
            {editDeck?.cards.map((card, index) => (
              <CourseFlashcardsNav
                key={index}
                index={(index + 1).toString()}
                label={`Flashcard ${index + 1}`}
                showDelete={true}
                onDelete={() => handleDeleteFlashcard(index)}
              />
            ))}

            <button
              className="bg-blue-500 text-white font-bold px-4 py-2.5 max-w-[200] rounded-lg text-center cursor-pointer"
              onClick={handleAddFlashcard}
            >
              + Add Flashcard
            </button>
          </nav>
          <div className="w-full bg-white rounded-lg shadow-sm p-10">
            <>
              <div className="block font-semibold mb-3 text-gray-800">
                Edit Flashcard {currentCIndex + 1}
              </div>
              <div>
                <label className="block font-semibold mb-3 text-gray-800">
                  Question
                </label>
                <textarea
                  value={currentCard?.front_text}
                  onChange={(e) =>
                    handleFlashcardUpdate("front_text", e.target.value)
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
                  value={currentCard?.topic_id}
                  onChange={(e) =>
                    handleFlashcardUpdate("topic_id", e.target.value)
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
              <div>
                <label className="block font-semibold mb-3 text-gray-800">
                  Explanation
                </label>
                <textarea
                  value={currentCard?.back_text || ""}
                  onChange={(e) =>
                    handleFlashcardUpdate("back_text", e.target.value)
                  }
                  placeholder="Enter your explanation here..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px] resize-y"
                />
              </div>
            </>
          </div>
        </section>
      </div>
      {isEdit && (
        <div className="mt-auto flex justify-end items-center px-20 py-5 gap-10 bg-white">
          <div>Save Change?</div>
          <button
            className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 cursor-pointer"
            onClick={handleCancel}
          >
            Cancle
          </button>
          <button
            className="bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-center cursor-pointer"
            onClick={handleUpdateSubmit}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
