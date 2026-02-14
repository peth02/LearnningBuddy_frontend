"use client";
import { useEffect, useState } from "react";
import {
  Topics,
  Flashcards,
  Quizzes,
  Topics2,
} from "@/components/CourseContentTabs";
import { CreateQuizForm, EditCourseForm } from "@/components/Forms";
import { enrollCourse, getCourseByID } from "@/services/course";
import { useParams, useRouter } from "next/navigation";
import { Course } from "@/types/Course";

export default function CourseId() {
  const [data, setData] = useState<Course>();
  const [content, setContent] = useState("topic");
  const [editCourse, setEditCourse] = useState(false);
  const [createQuiz, setCreateQuiz] = useState(false);

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const formattedDate = data?.updated_at
    ? new Date(data.updated_at).toLocaleDateString()
    : "-";

  const handleUpdateMeta = (field: keyof Course, value: any) => {
    setData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleEnrollCourse = () => {
    const res = enrollCourse(id);
    if (data) {
      data.is_enrolled = true;
      location.reload();
    }
  };
  const handleEdit = () => {
    setEditCourse((prev) => !prev);
  };
  const handleAddTopic = () => {};
  const handleDelTopic = (topic_id: string) => {
    console.log("del topic", topic_id);
    
  };
  const handleNavigateToTopic = (topic_id: string) => {
    router.push(`/course/${id}/topic/${topic_id}`); // เปลี่ยน path ตามที่คุณตั้งไว้
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
    <div className="flex flex-col min-h-screen  gap-7 py-10 px-20 bg-gray-100">
      <section className="bg-white rounded-lg shadow-sm p-10">
        {!editCourse && data ? (
          <div className="flex grow-0 w-full">
            <div className=" text-m text-wrap w-full">
              <h2 className="text-xl font-bold uppercase">{data.title}</h2>
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
                <div className="text-gray-800 break-all">
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
              <a
                onClick={handleEdit}
                className="ml-auto cursor-pointer h-fit text-gray-600 underline"
              >
                Edit
              </a>
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
          {/* content */}
          {content == "flashcard" ? (
            <div className="p-10">
              <div className="place-content-end">
                {/*  only creator can see */}
                {data?.is_owner ? (
                  <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600">
                    + Create Deck
                  </button>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Flashcards />
              </div>
            </div>
          ) : content == "quiz" ? (
            <div className="p-10">
              <div className="place-content-end">
                {/*  only creator can see */}
                {data?.is_owner ? (
                  <button
                    onClick={handleCreateQuiz}
                    className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
                  >
                    + Create Quiz
                  </button>
                ) : null}

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
                {data?.is_owner ? (
                  <button className="mb-5 mr-auto min-w-[100px] bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600">
                    + Add Topic
                  </button>
                ) : null}
              </div>
              {data?.topics.map((topic, index) => (
                <div key={index} className="mt-5">
                  <Topics2
                    handleNavigate={() => handleNavigateToTopic(topic.topicId)}
                    handleDel={() => handleDelTopic(topic.topicId)}
                    index={index}
                    topic={topic}
                    isOwner={data.is_owner}
                  ></Topics2>
                </div>
              ))}
              <div className="flex flex-col gap-4">{/* <Topics /> */}</div>
            </div>
          ) : null}
          {/* <Topics items={data}/> */}
        </div>
      </section>
    </div>
  );
}
