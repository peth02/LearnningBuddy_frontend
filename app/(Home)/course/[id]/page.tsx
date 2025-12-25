"use client";
import { useState } from "react";
import { Topics, Flashcards, Quizzes } from "@/components/CourseContentTabs";

export default function Course() {
  const data = ["1", "2"];
  const [content, setContent] = useState("topic");
  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      <section className="bg-white rounded-lg shadow-sm p-10">
        {/* enroll */}
        {/* edit  */}
        <div>head</div>
        <div>description</div>
        <div>courses progress</div>
      </section>
      <section className="bg-white rounded-lg shadow-sm min-h-screen">
        <div className="flex border-b-1 border-gray-300">
          <div
            onClick={() => {
              setContent("topic");
            }}
            className={`px-10 py-4 cursor-pointer ${
              content === "topic" ? "border-b border-black" : "border-b-0"
            }`}
          >
            Topics
          </div>
          <div
            onClick={() => {
              setContent("flashcard");
            }}
            className={`px-10 py-4 cursor-pointer ${
              content === "flashcard" ? "border-b border-black" : "border-b-0"
            }`}
          >
            Flashcard
          </div>
          <div
            onClick={() => {
              setContent("quiz");
            }}
            className={`px-10 py-4 cursor-pointer ${
              content === "quiz" ? "border-b border-black" : "border-b-0"
            }`}
          >
            Quizzes
          </div>
        </div>
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
