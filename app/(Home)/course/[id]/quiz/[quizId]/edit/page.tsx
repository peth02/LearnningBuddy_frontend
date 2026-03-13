"use client";
import Alert from "@/components/Aleart";
import { EditQuizMetaForm } from "@/components/Forms";
import { CourseQuestionsNav } from "@/components/Navbar";
import { getCourseByID } from "@/services/course";
import { getQuizByQuizId, updateCourseQuizById } from "@/services/quiz";
import { Choice, Course, Question, Quiz2 } from "@/types/Course";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditQuiz() {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [course, setCourse] = useState<Course>();
  const [quiz, setQuiz] = useState<Quiz2>();
  const [editQuiz, setEditQuiz] = useState<Quiz2>();
  const [editQuestions, setEditQuestions] = useState<Question[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isEditMeta, setIsEditMeta] = useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const quiz_id = params.quizId;
  const course_id = params.id;

  // ดึงลำดับคำถามปัจจุบันจาก URL
  const currentQIndex = parseInt(searchParams.get("q") || "1") - 1;
  const currentQuestion = editQuestions[currentQIndex];

  const handleEdit = () => {
    setIsEditMeta((prev) => !prev);
  };

  const handleUpdateMeta = (field: keyof Quiz2, value: any) => {
    setQuiz((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // --- Handlers สำหรับแก้ไขคำถามภายใน Quiz ---
  const handleQuestionUpdate = (field: keyof Question, value: any) => {
    setIsEdit(true);

    // 1. สร้าง Array ใหม่จาก editQuestions ปัจจุบัน
    const updatedQuestions = [...editQuestions];
    updatedQuestions[currentQIndex] = {
      ...updatedQuestions[currentQIndex],
      [field]: value,
    };

    // 2. อัปเดต editQuestions เพื่อให้ UI เปลี่ยนแปลงทันที
    setEditQuestions(updatedQuestions);

    // 3. อัปเดต editQuiz ให้สอดคล้องกัน (เผื่อใช้ส่ง API)
    setEditQuiz((prev) =>
      prev ? { ...prev, questions: updatedQuestions } : prev,
    );
  };
  // --- Handlers สำหรับ Choices ---
  const handleChoiceUpdate = (
    choiceIndex: number,
    field: keyof Choice,
    value: any,
  ) => {
    setIsEdit(true);

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

  const handleAddChoice = () => {
    setIsEdit(true);
    const newChoice: Choice = {
      choice_text: "",
      is_correct: false,
      explanation: "", // ✅ เพิ่มค่าเริ่มต้นสำหรับคำอธิบายตัวเลือก
    };
    const updatedChoices = [...(currentQuestion?.choices || []), newChoice];
    handleQuestionUpdate("choices", updatedChoices);
  };

  const handleRemoveChoice = (choiceIndex: number) => {
    if ((currentQuestion?.choices?.length || 0) <= 2) {
      window.alert("A question must have at least 2 choices.");
      return;
    }
    setIsEdit(true);
    const updatedChoices = currentQuestion?.choices.filter(
      (_, i) => i !== choiceIndex,
    );
    handleQuestionUpdate("choices", updatedChoices);
  };
  const handleAddQuestion = () => {
    setIsEdit(true);
    const newQ: Question = {
      topic_id: course?.topics?.[0]?.topicId?.toString() || "",
      question_text: "New Question",
      question_type: "NORMAL_MULTIPLE",
      difficulty: "EASY",
      explanation: "",
      choices: [
        { choice_text: "First Option", is_correct: true },
        { choice_text: "Second Option", is_correct: false },
      ],
    };

    const updatedQuestions = [...editQuestions, newQ];
    setEditQuestions(updatedQuestions);
    setEditQuiz((prev) =>
      prev ? { ...prev, questions: updatedQuestions } : prev,
    );

    const nextIndex = updatedQuestions.length;
    router.push(`?q=${nextIndex}`, { scroll: false });
  };

  // --- การลบคำถาม (ปรับให้ใช้ editQuestions) ---
  const handleDeleteQuestion = (indexToDelete: number) => {
    if (!window.confirm("Delete this question?")) return;
    setIsEdit(true);

    const updatedQuestions = editQuestions.filter(
      (_, i) => i !== indexToDelete,
    );

    setEditQuestions(updatedQuestions);
    setEditQuiz((prev) =>
      prev ? { ...prev, questions: updatedQuestions } : prev,
    );

    // Routing Logic
    const activeIdx = parseInt(searchParams.get("q") || "1");
    if (activeIdx > updatedQuestions.length) {
      router.push(`?q=${Math.max(1, updatedQuestions.length)}`, {
        scroll: false,
      });
    }
  };
  const handleUpdateSubmit = async () => {
    try {
      const res: any = await updateCourseQuizById(quiz_id, editQuestions);
      if (res.success) {
        setAlert({ message: res.message, type: "success" });
        setIsEdit(false);
        handleUpdateMeta("questions", editQuestions);
      } else {
        setAlert({
          message: res.message || "Update quiz failed",
          type: "error",
        });
      }
      // if (res) {
      //   window.alert(res.data.message);
      //   setIsEdit(false);
      //   handleUpdateMeta("questions", editQuestions);
      // }
    } catch {
      setAlert({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };
  const handleCancel = () => {
    if (window.confirm("Discard changes?")) {
      // 1. รีเซ็ตคำถามกลับไปเป็นค่าดั้งเดิมจาก API (ใช้ [] ป้องกัน error)
      const originalQuestions = quiz?.questions || [];
      setEditQuestions(originalQuestions);
      setIsEdit(false);
      setIsEditMeta(false);
    }
  };

  useEffect(() => {
    if (!quiz_id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response1 = await getCourseByID(course_id);
        // console.log("Data1 loaded:", response1);
        setCourse(response1);

        const response2 = await getQuizByQuizId(quiz_id);
        // console.log("Data2 loaded:", response2);
        setQuiz(response2);
        setEditQuiz(response2);
        setEditQuestions(response2.questions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [quiz_id]);

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
        <section className="bg-white rounded-lg shadow-sm p-10">
          {!isEditMeta && quiz ? (
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
                      {quiz.title}
                    </h2>
                    {quiz.is_published ? (
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
                    Edit Quiz Info
                  </button>
                </div>

                <div className="mt-7 flex gap-10">
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase">
                      Solution Visibility:
                    </h3>
                    <div className="text-gray-800 font-medium">
                      {quiz.solution_visibility}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500 uppercase">
                      Total Questions:
                    </h3>
                    <div className="text-gray-800 font-medium">
                      {quiz?.questions?.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : isEditMeta && quiz ? (
            <EditQuizMetaForm
              quiz={quiz}
              setDataForm={handleUpdateMeta}
              stateChange={handleEdit}
              setAlert={setAlert}
            />
          ) : null}
        </section>
        <section className="flex flex-1 mt-10 gap-10">
          <nav className="flex flex-col h-fit mx-auto bg-white rounded-lg shadow-sm py-10 px-5 max-h-200 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <h3 className="font-semibold w-[200px]">Questions</h3>
            {editQuiz?.questions.map((question, index) => (
              <CourseQuestionsNav
                key={index}
                index={(index + 1).toString()}
                label={`question ${index + 1}`}
                showDelete={true}
                onDelete={() => handleDeleteQuestion(index)}
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
