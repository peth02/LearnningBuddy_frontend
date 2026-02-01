import { redirect, useRouter } from "next/navigation";
import Form from "next/form";
import React, { ChangeEvent, useState } from "react";
import { getToken } from "@/lib/session";
import { useCourseStore } from "@/lib/courseStore";
import { EditCourseFormProps } from "@/types/Form";
import router from "next/router";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export function EditCourseForm({
  data,
  setDataForm,
  stateChange,
}: EditCourseFormProps) {
  const router = useRouter();

  const EditCourseHandler = async (formData: FormData) => {
    const url = `${baseURL}/courses/${data.course_id}`;
    const token = await getToken();
    try {
      const sendData = {
        title: formData.get("name")?.toString() || data.title,
        description:
          formData.get("description")?.toString() || data.description,
        is_published: formData.get("isPublic") === "on",
      };

      if (!token || token === "undefined") {
        alert("Please log in again.");
        router.push("/login");
        return;
      }
      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "Application/json",
        },
        body: JSON.stringify(sendData),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Server response:", data);
        alert("Successfully edit course");
        console.log("edit Course");
        stateChange();
      } else {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
      }
    } catch (error: any) {
      console.log("error", error);
    }
  };

  const DeleteCourseHandler = async () => {
    const remove = confirm("do you want to delete this course");
    if (remove) {
      console.log("deleting Course");
      const url = `${baseURL}/courses/${data.course_id}`;
      const token = await getToken();
      try {
        if (!token || token === "undefined") {
          alert("Please log in again.");
          router.push("/login");
          return;
        }
        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "Application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("Server response:", data);
          alert("Successfully delet course");
          router.push("/home");
        } else {
          const errorText = await res.text();
          console.error("Delete failed:", errorText);
        }
      } catch (error: any) {
        console.log("error", error);
      }
    } else {
      console.log("phewww almost delete a course");
    }
  };

  return (
    <section>
      <h2 className="text-xl">Edit course</h2>
      <Form action={EditCourseHandler} className="flex flex-col mt-5 gap-5">
        <label>Title</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={data?.title}
          placeholder="Name"
          onChange={(e) => setDataForm("title", e.target.value)}
          className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <label>Description</label>
        <input
          name="description"
          type="text"
          required
          defaultValue={data?.description}
          onChange={(e) => setDataForm("description", e.target.value)}
          placeholder="Description"
          className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <label>
          <input
            name="isPublic"
            type="checkbox"
            defaultChecked={data?.is_published}
            onChange={(e) => setDataForm("is_published", e.target.value)}
            className="rounded border-gray-300 accent-blue-600 cursor-pointer"
          />
          <span> Public this course</span>
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
            onClick={stateChange}
            className="bg-white text-black p-2 border-2 border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            Cancle
          </button>
        </div>
      </Form>
    </section>
  );
}

export function CreatePreviewCourseForm(props: any) {
  const [stage, setStage] = useState(1);
  const [name, setName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // 1. เพิ่ม State สำหรับสถานะต่างๆ
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const setCourse = useCourseStore((state) => state.setCourse);
  const router = useRouter();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

  const validateAndSetFile = (fileInput: File) => {
    setErrorMsg(null);
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (fileInput.type !== "application/pdf") {
      setErrorMsg("Invalid file type. Please upload a PDF.");
      return;
    }

    if (fileInput.size > maxFileSize) {
      setErrorMsg("File is too large. Max size is 5MB.");
      setFile(null);
      return;
    }

    setFile(fileInput);
    setErrorMsg(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setSubmitStatus("submitting");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 50));
    const url = `${baseURL}/courses/preview`;
    console.log("sending ", name, desc, file, "to ", url);
    const token = await getToken();
    console.log("user", token);
    try {
      // create form data
      const sendData = new FormData();
      if (file) {
        sendData.append("title", name);
        sendData.append("description", desc);
        sendData.append("file", file);
      }
      if (!token || token === "undefined") {
        alert("Please log in again.");
        router.push("/login");
        return;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: sendData,
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Server response:", data);
        setSubmitStatus("success");
        setStatusMsg("Course created successfully!");
        setCourse(data);
      } else {
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
      }
    } catch (error: any) {
      setSubmitStatus("error");
      setStatusMsg(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={props.stageChange}
      />
      <section className="bg-white border-1 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Form action={handleSubmit}>
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
              <div className="m-5 flex flex-col gap-4">
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  // ปรับ style ตาม state isDragging (ถ้าลากอยู่ให้ขอบเป็นสีน้ำเงินเข้มและพื้นหลังเข้มขึ้น)
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-100"
                        : "border-blue-200 bg-blue-50/30 hover:bg-blue-50"
                    }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 min-w-[500px]">
                    <div
                      className={`p-3 rounded-full mb-3 ${isDragging ? "bg-blue-200" : "bg-blue-100"}`}
                    >
                      <svg
                        className={`w-6 h-6 ${isDragging ? "text-blue-700" : "text-blue-500"}`}
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
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-blue-600">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF only (MAX. 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    name="file"
                    className="hidden"
                    accept=".pdf"
                    required
                    onChange={handleFileChange}
                  />
                </label>
                {file && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg mt-5">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* File Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>

                      {/* File Info */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-gray-700 truncate max-w-[500px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatFileSize(file.size)} •{" "}
                          <span className="text-blue-600 font-medium">
                            Ready
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Checkmark / Action */}
                    <div className="flex-shrink-0 text-blue-500 bg-white p-1 rounded-full shadow-sm">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                {errorMsg && (
                  <div className="flex items-center gap-2 text-red-500 text-sm">
                    <svg
                      className="w-4 h-4"
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
                    <span>{errorMsg}</span>
                  </div>
                )}
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
        {/* Loading & Result Overlay */}
        {submitStatus !== "idle" && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[60] flex flex-col items-center justify-center p-6 text-center">
            {/* 1. แสดงตอนกำลังส่งข้อมูล (Submitting) */}
            {submitStatus === "submitting" && (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-700">
                  Uploading your course...
                </p>
              </div>
            )}

            {/* 2. แสดงเมื่อสำเร็จ (Success) */}
            {submitStatus === "success" && (
              <div className="max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-green-100">
                <div className="flex justify-center mb-4 text-green-500">
                  {/* Success Icon */}
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Success!
                </h3>
                <p className="text-gray-600 mb-6">{statusMsg}</p>
                <button
                  onClick={() => router.push("/my_created_courses/preview")}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Preview Course
                </button>
              </div>
            )}

            {/* 3. แสดงเมื่อเกิดข้อผิดพลาด (Error) */}
            {submitStatus === "error" && (
              <div className="max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-red-100">
                <div className="flex justify-center mb-4 text-red-500">
                  {/* Error Icon */}
                  <svg
                    className="w-16 h-16"
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">Oops!</h3>
                <p className="text-gray-600 mb-6">{statusMsg}</p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
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
  };
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
                  <button
                    onClick={handleClearTopics}
                    className="ml-auto mr-5 cursor-pointer"
                  >
                    clear
                  </button>
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
