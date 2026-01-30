import { redirect } from "next/navigation";
import Form from "next/form";
import React, { ChangeEvent, useState } from "react";
import { getToken } from "@/lib/session";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export function EditCourseForm(props: any) {
  const EditCourseHandler = () => {
    alert("Successfully edit course");
    console.log("edit Course");
    props.stateChange();
    // location.reload()
  };
  const DeleteCourseHandler = () => {
    const remove = confirm("do you want to delete this course");
    if (remove) {
      console.log("delete Course");
      // redirect("/my_created_courses");
    } else {
      console.log("phewww almost delete a course");
    }
  };

  return (
    <section>
      <div>Edit course</div>
      <Form action={EditCourseHandler} className="flex flex-col mt-5 gap-5">
        <input
          name="name"
          type="text"
          required={true}
          defaultValue={"1"}
          placeholder="Name"
          className="border-1"
        />

        <input
          name="description"
          type="text"
          required={true}
          defaultValue={"stesilatf"}
          placeholder="Description"
          className="border-1"
        />
        <label>
          <input name="isPublic" type="checkbox" defaultChecked={true} />
          <span>Public</span>
        </label>
        <div className="flex gap-10">
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg cursor-pointer hover:bg-blue-600"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={DeleteCourseHandler}
            className="bg-red-500 text-white p-2 rounded-lg cursor-pointer hover:bg-red-600"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={props.stateChange}
            className="bg-white text-black p-2 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            Cancle
          </button>
        </div>
      </Form>
    </section>
  );
}

export function CreateCourseForm(props: any) {
  type Status = "idle" | "loading" | "error";

  const [stage, setStage] = useState(1);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [uploadProgress, SetUploadProgress] = useState();

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    if (form) {
      if (form.checkValidity()) {
        setStage((prev) => prev + 1);
      } else {
        form.reportValidity();
      }
    }
  };
  const handleBack = () => {
    setStage((prev) => prev - 1);
  };
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const handleSubmit = async () => {
    const url = `${baseURL}/courses/preview`;
    console.log("sending ", name, desc, file, "to ", url)

    const token = await getToken();
    console.log("user", token);

    try {
      // create form data
      const sendData = new FormData();
      if (file) {
        sendData.append("title", name)
        sendData.append("description", desc)
        sendData.append("file", file)
      }
      if (!token || token === "undefined") {
      alert("Please log in again.");
      return;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: sendData
      })
      if (res.ok) {
        console.log("Upload success");
        const data = await res.json();
        console.log("Server response:", data);
      } else {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
      }
    } catch (error) {
      console.error("Error creating course", error);
    }
  };
  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={props.stageChange}
      />
      <section className="bg-white border-1 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Form
          action={handleSubmit}
        >
          {stage == 1 && (
            <div>
              <div className="flex justify-between m-5">
                <div>Name Your Course</div>
                <button
                  onClick={props.stageChange}
                  className="text-gray-400 cursor-pointer hover:underline"
                >
                  x
                </button>
              </div>
              <hr />
              <div className="flex flex-col gap-5 m-5">
                <p>Give your Course a descriptive name and description</p>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  required={true}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <hr />
              <div className="flex m-5">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-[100px] ml-auto bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          {stage == 2 && (
            <div>
              <div className="flex justify-between m-5">
                <div>Upload file</div>
                <button
                  onClick={props.stageChange}
                  className="text-gray-400 cursor-pointer hover:underline"
                >
                  x
                </button>
              </div>
              <hr />
              <div className="m-5">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PDF only (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    name="file"
                    className="hidden"
                    accept=".pdf"
                    required
                    onChange={handleFile}
                  />
                </label>
                <div className="mt-3">upload status</div>
              </div>
              <hr />
              <div className="flex justify-between m-5">
                <button onClick={handleBack} className="cursor-pointer">
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </Form>
      </section>
    </div>
  );
}

export function CreateQuizForm(props: any) {
  type Status = "idle" | "loading" | "error";

  const [name, setName] = useState<string>("");
  const [topics, setTopics] = useState<string[]>([
    "Topic 1",
    "Topic 2",
    "Topic 3",
    "Topic 4",
    "Topic 5",
    "Topic 6",
  ]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [stage, setStage] = useState(1);
  const [status, setStatus] = useState<Status>("idle");

const handleToggleTopic = (topic: string) => {
    let newSelection: string[];

    if (selectedTopics.includes(topic)) {
      // Remove topic
      newSelection = selectedTopics.filter((t) => t !== topic);
    } else {
      // Add topic
      newSelection = [...selectedTopics, topic];
    }
    // Sort based on the index in the original 'topics' array
    newSelection.sort((a, b) => topics.indexOf(a) - topics.indexOf(b));
    
    setSelectedTopics(newSelection);
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.closest("form");
    if (form) {
      if (form.checkValidity()) {
        setStage((prev) => prev + 1);
      } else {
        form.reportValidity();
      }
    }
  };
  const handleBack = () => {
    setStage((prev) => prev - 1);
  };
  const handleAddTopic = (e: any) => {
    e.target.style();
  };
  const handleClearTopics = () => {
    setSelectedTopics([]);
  }
  const handleAddQuestion = () => {};
  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={props.stageChange}
      />
      <section className="bg-white border-1 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Form action={() => console.log("create quiz")}>
          {stage == 1 && (
            <div>
              <div className="flex justify-between m-5">
                <div>Name Your Quiz</div>
                <button
                  onClick={props.stageChange}
                  className="text-gray-400 cursor-pointer hover:underline"
                >
                  x
                </button>
              </div>
              <hr />
              <div className="flex flex-col gap-5 m-5">
                <p>
                  Give your quiz a descriptive name to help you identify it
                  later.
                </p>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g., Midterm Practice Quiz"
                  value={name}
                  required={true}
                  onChange={(e) => setName(e.target.value)}
                  className="border-1"
                />
              </div>
              <hr />
              <div className="flex m-5">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-[100px] ml-auto bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          {stage == 2 && (
            <div className="flex flex-col">
              <div className="flex justify-between m-5">
                <div>
                  Configure Quiz
                  <br />
                  <span>Set questions per topic with specific formats</span>
                </div>
                <button
                  onClick={props.stageChange}
                  className="text-gray-400 cursor-pointer hover:underline"
                >
                  x
                </button>
              </div>
              <hr />
              <section className="m-5 max-h-[50vh] overflow-auto">
                <div className="flex">
                  <p>Select topic</p>
                  <button onClick={handleClearTopics} className="ml-auto mr-5 cursor-pointer">clear</button>
                </div>
                <div className="flex flex-wrap gap-3 mt-3">
                  {/* map topics */}
                  {topics.map((topic, index) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <div
                        key={index}
                        onClick={() => handleToggleTopic(topic)}
                        className={`p-2 border rounded-lg cursor-pointer transition-colors duration-200 
                                  ${
                                    isSelected
                                      ? "bg-blue-500 text-white border-blue-600" // Style เมื่อถูกเลือก
                                      : "bg-white text-gray-700 hover:bg-gray-100" // Style ปกติ
                                  }`}
                      >
                        <span>{topic}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col">
                  {selectedTopics.map((topic, index) => {
                    return (
                      <div
                        key={index}
                        className="mx-5 my-2 border-1 rounded-lg overflow-hidden"
                      >
                        <div
                          onClick={() => console.log("click")}
                          className="bg-gray-200 p-5"
                        >
                          <span>{topic}</span>
                          <span>(0 question)</span>
                        </div>
                        {/* easy */}
                        <div className="flex- flex-col m-5 p-5 bg-green-200 border-1 border-green-400 rounded-lg">
                          <div className="flex justify-between">
                            <p>Easy</p>
                            <button>+ Add</button>
                          </div>
                        </div>
                        {/* normal */}
                        <div className="flex- flex-col m-5 p-5 bg-orange-200 border-1 border-orange-400 rounded-lg">
                          <div className="flex justify-between">
                            <p>Normal</p>
                            <button>+ Add</button>
                          </div>
                        </div>
                        {/* hard */}
                        <div className="flex- flex-col m-5 p-5 bg-red-200 border-1 border-red-400 rounded-lg">
                          <div className="flex justify-between">
                            <p>Hard</p>
                            <button>+ Add</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
              <hr />
              <div className="flex justify-between m-5">
                <button onClick={handleBack} className="cursor-pointer">
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Generate Draft
                </button>
              </div>
            </div>
          )}
        </Form>
      </section>
    </div>
  );
}
