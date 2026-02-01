"use client";
import { useEffect, useState } from "react";
import { Topics, Flashcards, Quizzes } from "@/components/CourseContentTabs";
import { CreateQuizForm, EditCourseForm } from "@/components/Forms";
import { getCourseByID } from "@/services/course";
import { useParams, useSearchParams } from "next/navigation";
import { Course } from "@/types/Course";

export default function CourseId() {
  const [data, setData] = useState<Course>();
  const [content, setContent] = useState("topic");
  const [editCourse, setEditCourse] = useState(false);
  const [createQuiz, setCreateQuiz] = useState(false);

  const params = useParams();
  const id = params.id;

  const handleUpdateMeta = (field: keyof Course, value: any) => {
    setData((prev) => (prev ? { ...prev, [field]: value }: prev));
  };

  const HandleEdit = () => {
    setEditCourse((prev) => !prev);
  };
  const handleCreateQuiz = () => {
    setCreateQuiz((prev) => !prev);
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
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      <section className="bg-white rounded-lg shadow-sm p-10">
        {!editCourse && data ? (
          <div className="flex">
            <div>
              <h2 className="text-xl font-bold">{data.title}</h2>
              <div>Description</div>
              <div>{data.description}</div>
              {/* <div></div> */}
            </div>
            <a
              onClick={HandleEdit}
              className="ml-auto cursor-pointer h-fit text-gray-600 underline"
            >
              Edit
            </a>
          </div>
        ) : (
          editCourse &&
          data && (
            <EditCourseForm
              data={data}
              setDataForm={handleUpdateMeta}
              stateChange={HandleEdit}
            />
          )
        )}
        {/* enroll */}
      </section>
      <section className="bg-white rounded-lg shadow-sm min-h-screen">
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
          {content == "flashcard" ? (
            <div className="p-10">
              <div className="place-content-end">
                {/*  only creator can see */}
                <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600">
                  + Create Deck
                </button>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Flashcards />
              </div>
            </div>
          ) : content == "quiz" ? (
            <div className="p-10">
              <div className="place-content-end">
                {/*  only creator can see */}
                <button
                  onClick={handleCreateQuiz}
                  className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
                >
                  + Create Quiz
                </button>
                {createQuiz && (
                  <CreateQuizForm stageChange={handleCreateQuiz} />
                )}
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Quizzes />
              </div>
            </div>
          ) : content == "topic" ? (
            <div className="p-10">
              <div className="place-content-end">
                {/*  only creator can see */}
                <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600">
                  + Add Topic
                </button>
              </div>
              <div className="flex flex-col gap-4">{/* <Topics /> */}</div>
            </div>
          ) : null}
          {/* <Topics items={data}/> */}
        </div>
      </section>
    </div>
  );
}
