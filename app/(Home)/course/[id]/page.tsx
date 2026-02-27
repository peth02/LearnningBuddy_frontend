"use client";
import { useEffect, useState } from "react";
import {
  Topics,
  Flashcards,
  Quizzes,
  Topics2,
  FlashcardDecks,
} from "@/components/CourseContentTabs";
import {
  CreateFlashCardForm,
  CreateQuizForm,
  EditCourseForm,
} from "@/components/Forms";
import {
  enrollCourse,
  getCourseByID,
  getCourseTopics,
  updateCourseTopic,
} from "@/services/course";
import { useParams, useRouter } from "next/navigation";
import { Course, FlashcardDeck, Quiz, Topic2 } from "@/types/Course";
import { getQuizzesByCourseId } from "@/services/quiz";
import { FlashcardHistoryModal, QuizHistoryModal } from "@/components/ShowJobs";
import { getDecksByCourseId } from "@/services/flashcard";

export default function CourseId() {
  const [data, setData] = useState<Course>();
  const [topics, setTopics] = useState<Topic2[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>();
  const [flashcardsDeck, setFlashcardsDeck] = useState<FlashcardDeck[]>();
  const [content, setContent] = useState<"topic" | "flashcard" | "quiz">(
    "topic",
  );
  const [editCourse, setEditCourse] = useState(false);
  const [delTopic, setDelTopic] = useState<string[]>([]);
  const [createQuiz, setCreateQuiz] = useState(false);
  const [createFlashcard, setCreateFlashcard] = useState(false);
  const [showQuizJobs, setShowQuizJobs] = useState(false);
  const [showFlashcardJobs, setShowFlashcardJobs] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const formattedDate = data?.updated_at
    ? new Date(data.updated_at).toLocaleDateString()
    : "-";

  const handleUpdateMeta = (field: keyof Course, value: any) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleEnrollCourse = async () => {
    const res = await enrollCourse(id);
    if (res && data) {
      data.is_enrolled = true;
      location.reload();
    }
  };
  const handleEdit = () => {
    setEditCourse((prev) => !prev);
  };
  const handleAddTopic = () => {};

  const handleDelTopics = (e: React.MouseEvent, topic_id: string) => {
    e.stopPropagation(); // กันไม่ให้ไป trigger onClick ของการ์ด
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    setDelTopic((prev) => [...prev, topic_id]);
  };

  const handleUpdateTopics = async () => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        topics: prev.topics.filter((t) => !delTopic.includes(t.topicId)),
      };
    });
    setTopics((prev) => {
      if (!prev) return prev;
      return prev.filter((t) => !delTopic.includes(t.id));
    });

    if (topics) {
      const updatedTopics = topics.filter((t) => !delTopic.includes(t.id));
      try {
        if (updatedTopics) {
          const res = await updateCourseTopic(id, updatedTopics);
          console.log("successfully updated topics on server:", res);
        }
        setDelTopic([]);
      } catch (error) {
        console.error("Failed to update:", error);
        alert("Update failed, please try again.");
      }
    }
  };

  const handleNavigateToTopic = (topic_id: string) => {
    router.push(`/course/${id}/topic?topic=${topic_id}`); // เปลี่ยน path ตามที่คุณตั้งไว้
  };
  const handleNavigateToQuiz = (quiz_id: string) => {
    router.push(`/course/${id}/quiz/${quiz_id}`);
  };
  const handleNavigateToEditQuiz = (quiz_id: string) => {
    router.push(`/course/${id}/quiz/${quiz_id}/edit`);
  };
  const handleNavigateToDeck = (deck_id: string) => {
    router.push(`/course/${id}/flashcard/${deck_id}`);
  };
  const handleNavigateToEditDeck = (deck_id: string) => {
    router.push(`/course/${id}/flashcard/${deck_id}/edit`);
  };
  const handleCreateQuiz = () => {
    setCreateQuiz((prev) => !prev);
  };
  const handleCreateFlashcard = () => {
    setCreateFlashcard((prev) => !prev);
  };
  const handleShowQuizJobs = () => {
    setShowQuizJobs((prev) => !prev);
  };
  const handleShowFlashcardJobs = () => {
    setShowFlashcardJobs((prev) => !prev);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await getCourseByID(id);
        console.log("Data loaded:", response);
        setData(response);

        const response2 = await getCourseTopics(id);
        console.log("Data loaded:", response2);
        setTopics(response2.topics);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    if (content === "quiz" && !quizzes) {
      const fetchQuizzes = async () => {
        try {
          const res = await getQuizzesByCourseId(id);
          setQuizzes(res);
          console.log("quiz", res);
        } catch (error) {
          console.error("Error loading quizzes:", error);
        }
      };
      fetchQuizzes();
    }
    if (content === "flashcard" && !flashcardsDeck) {
      const fetchFlashcards = async () => {
        try {
          const res = await getDecksByCourseId(id);
          setFlashcardsDeck(res);
          console.log("flashcard", res);
        } catch (error) {
          console.error("Error loading flashcards:", error);
        }
      };
      fetchFlashcards();
    }
  }, [content]);

  return (
    <div>
      <div className="flex flex-col min-h-screen  gap-7 py-10 px-20 bg-gray-100">
        <section className="bg-white rounded-lg shadow-sm p-10">
          {!editCourse && data ? (
            <div className="flex grow-0 w-full">
              <div className=" text-m text-wrap w-full">
                <h2 className="text-xl font-bold uppercase break-all mr-20">
                  {data.title}
                </h2>
                {data.is_published ? (
                  <div className="mt-2 text-green-500 bg-green-200 px-2 py-1 rounded-lg font-bold text-sm h-fit w-fit">
                    Public
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500 bg-gray-200 px-2 py-1 rounded-lg font-bold text-sm h-fit w-fit">
                    Private
                  </div>
                )}
                <div className="mt-7">
                  <h3 className="font-semibold">Description :</h3>
                  <div className="text-gray-800 break-all mr-20">
                    {data.description}
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold">Last update :</h3>
                  <div className="text-gray-800">{formattedDate}</div>
                </div>
                {!data.is_enrolled && !data.is_owner ? (
                  <div className="mt-6 gap-6">
                    <button
                      onClick={handleEnrollCourse}
                      className="bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
                    >
                      Enroll
                    </button>
                  </div>
                ) : null}
              </div>
              {data.is_owner ? (
                <button
                  onClick={handleEdit}
                  className="flex items-start gap-2 text-gray-600 cursor-pointer hover:underline"
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
          ) : (
            editCourse &&
            data && (
              <EditCourseForm
                data={data}
                setDataForm={handleUpdateMeta}
                stateChange={handleEdit}
              />
            )
          )}
        </section>
        <section className="bg-white rounded-lg shadow-sm min-h-fit">
          <nav className="flex border-b-1 border-gray-300">
            <a
              onClick={() => {
                setContent("topic");
              }}
              className={`px-10 py-4 cursor-pointer ${
                content === "topic"
                  ? "text-blue-500 font-bold border-b-2 border-blue"
                  : ""
              }`}
            >
              Topics
            </a>
            <a
              onClick={() => {
                setContent("flashcard");
              }}
              className={`px-10 py-4 cursor-pointer ${
                content === "flashcard"
                  ? "text-blue-500 font-bold border-b-2 border-blue"
                  : ""
              }`}
            >
              Flashcards
            </a>
            <a
              onClick={() => {
                setContent("quiz");
              }}
              className={`px-10 py-4 cursor-pointer ${
                content === "quiz"
                  ? "text-blue-500 font-bold border-b-2 border-blue"
                  : ""
              }`}
            >
              Quizzes
            </a>
          </nav>
          {/* <hr className="mb-3 bg-gray-300 h-[1px] border-none"/> */}
          <div>
            {/* content */}
            {content == "flashcard" ? (
              <div className="p-10">
                <div className="flex justify-between">
                  {/*  only creator can see */}
                  {data?.is_owner ? (
                    <>
                      <button
                        onClick={handleCreateFlashcard}
                        className="mb-5 min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
                      >
                        + Create Deck
                      </button>
                      <button
                        onClick={handleShowFlashcardJobs}
                        className="mb-5 min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
                      >
                        show history
                      </button>
                    </>
                  ) : null}

                  {createFlashcard && (
                    <CreateFlashCardForm
                      stageChange={handleCreateFlashcard}
                      topics={topics}
                    />
                  )}
                  {showFlashcardJobs && (
                    <FlashcardHistoryModal
                      course_id={id}
                      setStage={handleShowFlashcardJobs}
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {data && flashcardsDeck && flashcardsDeck?.length > 0 ? (
                    flashcardsDeck.map((deck, index) => (
                      <FlashcardDecks
                        key={index}
                        handleNavigateTo={handleNavigateToDeck}
                        handleNavigateEdit={handleNavigateToEditDeck}
                        index={index}
                        deck={deck}
                        isOwner={data.is_owner}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <div className="text-gray-400 text-5xl mb-4">📝</div>
                      <div className="text-gray-500 font-medium text-lg">
                        No decks available yet.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : content == "quiz" ? (
              <div className="p-10">
                <div className="flex justify-between">
                  {/*  only creator can see */}
                  {data?.is_owner ? (
                    <>
                      <button
                        onClick={handleCreateQuiz}
                        className="mb-5 min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
                      >
                        + Create Quiz
                      </button>
                      <button
                        onClick={handleShowQuizJobs}
                        className="mb-5 min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
                      >
                        show history
                      </button>
                    </>
                  ) : null}

                  {createQuiz && (
                    <CreateQuizForm
                      stageChange={handleCreateQuiz}
                      topics={topics}
                    />
                  )}
                  {showQuizJobs && (
                    <QuizHistoryModal
                      course_id={id}
                      setStage={handleShowQuizJobs}
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {data && quizzes && quizzes?.length > 0 ? (
                    quizzes.map((quiz, index) => (
                      <Quizzes
                        key={index}
                        handleNavigateTo={handleNavigateToQuiz}
                        handleNavigateEdit={handleNavigateToEditQuiz}
                        index={index}
                        quiz={quiz}
                        isOwner={data.is_owner}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <div className="text-gray-400 text-5xl mb-4">📝</div>
                      <div className="text-gray-500 font-medium text-lg">
                        No quizzes available yet.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : content == "topic" ? (
              <div className="p-10">
                <div className="place-content-end">
                  {/*  only creator can see */}
                  {/* {data?.is_owner ? (
                    <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600">
                      + Add Topic
                    </button>
                  ) : null} */}
                </div>
                {data?.topics
                  // 1. กรองเอาเฉพาะตัวที่ ID ไม่อยู่ในลิสต์ delTopic
                  .filter((topic) => !delTopic.includes(topic.topicId))
                  .map((topic, index) => (
                    <div key={topic.topicId || index} className="mt-5">
                      <Topics2
                        handleNavigate={() =>
                          handleNavigateToTopic((index + 1).toString())
                        }
                        handleDel={(e) => handleDelTopics(e, topic.topicId)}
                        index={index}
                        topic={topic}
                        isOwner={data.is_owner}
                      />
                    </div>
                  ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
      {delTopic.length != 0 ? (
        <div className="mt-auto flex justify-end items-center px-20 py-5 gap-10 bg-white">
          <div>Delete {delTopic.length} topics</div>
          <button
            className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 cursor-pointer"
            onClick={() => {
              setDelTopic([]);
            }}
          >
            Cancle
          </button>
          <button
            className="bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-center cursor-pointer"
            onClick={handleUpdateTopics}
          >
            Confirm
          </button>
        </div>
      ) : null}
      {/* <button
        onClick={() => {
          console.log(quizzes);
        }}
      >
        click
      </button> */}
    </div>
  );
}
