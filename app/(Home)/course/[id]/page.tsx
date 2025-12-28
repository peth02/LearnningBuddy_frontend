"use client";
import { useState } from "react";
import { Topics, Flashcards, Quizzes } from "@/components/CourseContentTabs";
import { EditCourseForm } from "@/components/Forms";

export default function Course() {
  const data = ["1", "2"];
  const [content, setContent] = useState("topic");
  const [editCourse, setEditCourse ] = useState(false)

  const HandleEdit = () => {
    setEditCourse((prev) => !prev);
  }
  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      <section className="bg-white rounded-lg shadow-sm p-10">
        {
          !editCourse 
            ? (<div className="flex">
                <div>
                  <div>head</div>
                  <div>description</div>
                  <div>courses progress</div>
                </div>
                <a onClick={HandleEdit} className="ml-auto cursor-pointer h-fit text-gray-600 underline">Edit</a>
              </div>)
            : (<EditCourseForm stateChange={HandleEdit} />)
        }
      {/* enroll */}

      </section>
      <section className="bg-white rounded-lg shadow-sm min-h-screen">
        <nav className="flex border-b-1 border-gray-300">
          <a
            onClick={() => {
              setContent("topic");
            }}
            className={`px-10 py-4 cursor-pointer ${
              content === "topic" ? "text-blue-500 font-bold border-b-2 border-blue" : ""
            }`}
          >
            Topics
          </a>
          <a
            onClick={() => {
              setContent("flashcard");
            }}
            className={`px-10 py-4 cursor-pointer ${
              content === "flashcard" ? "text-blue-500 font-bold border-b-2 border-blue" : ""
            }`}
          >
            Flashcard
          </a>
          <a
            onClick={() => {
              setContent("quiz");
            }}
            className={`px-10 py-4 cursor-pointer ${
              content === "quiz" ? "text-blue-500 font-bold border-b-2 border-blue" : ""
            }`}
          >
            Quizzes
          </a>
        </nav>
        {/* <hr className="mb-3 bg-gray-300 h-[1px] border-none"/> */}
        <div>
          {content == "flashcard" ? (
            <Flashcards />
          ) : content == "quiz" ? (
            <Quizzes />
          ) : (
            <Topics />
          )}
          {/* <Topics items={data}/> */}
        </div>
      </section>
    </div>
  );
}
