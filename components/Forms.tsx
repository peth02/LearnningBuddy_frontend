import { redirect, useParams, useRouter } from "next/navigation";
import Form from "next/form";
import React, { ChangeEvent, useState } from "react";
import { getToken } from "@/lib/session";
import { useCourseStore } from "@/lib/courseStore";
import {
  EditCourseFormProps,
  EditQuizFormProps,
  CreatePreviewQuizFormProps,
  CreatePreviewFlashcardProps,
  EditDeckFormProps,
} from "@/types/Form";
import router from "next/router";
import { DeckTopicConfig, Topic2 } from "@/types/Course";
import { createQuizPreview } from "@/services/quiz";
import { createFlashcardPreview } from "@/services/flashcard";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export function EditCourseForm({
  data,
  setDataForm,
  stateChange,
  setAlert,
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
      const data2: any = await res.json();
      if (res.ok) {
        setAlert({ message: data2.message, type: "success" });
        setDataForm("title", sendData.title);
        setDataForm("description", sendData.description);
        setDataForm("is_published", sendData.is_published);
        stateChange();
      } else {
        setAlert({
          message: data2.message || "Update course metadata failed",
          type: "error",
        });
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const DeleteCourseHandler = async () => {
    const remove = confirm("do you want to delete this course");
    if (remove) {
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
          alert("Successfully delet course");
          router.push("/home");
        } else {
          const errorText = await res.text();
          console.error("Delete failed:", errorText);
        }
      } catch (error: any) {
        console.error("error", error);
      }
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
          className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <label>Description</label>
        <input
          name="description"
          type="text"
          defaultValue={data?.description}
          placeholder="Description"
          className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <label>
          <input
            name="isPublic"
            type="checkbox"
            defaultChecked={data?.is_published}
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
            Cancel
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitStatus("submitting");
    setIsLoading(true);

    // await new Promise((resolve) => setTimeout(resolve, 50));
    const url = `${baseURL}/courses/preview/jobs`;
    // console.log("sending ", name, desc, file, "to ", url);
    const token = await getToken();
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
        // console.log("Server response:", data);
        // setSubmitStatus("success");
        // setStatusMsg("Course created successfully!");
        // setCourse(data);
        router.push(`my_created_courses/preview_job?job=${data.job_id}`);
      } else {
        setSubmitStatus("error");
        const errorText = await res.text();
        console.error("Upload failed:", errorText);
      }
    } catch (error: any) {
      setSubmitStatus("error");
      setStatusMsg(error.message || "An unexpected error occurred");
      setFile(null);
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
                  <div className="flex justify-center items-center gap-2 text-red-500 text-sm">
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
          <div className="fixed w-full h-full inset-0 bg-white rounded-lg z-[60] flex flex-col items-center justify-center p-6 text-center">
            {/* 3. แสดงเมื่อเกิดข้อผิดพลาด (Error) */}
            {submitStatus === "error" && (
              <div className="flex flex-col justify-center w-full h-full bg-white ">
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

export function CreateQuizForm({
  stageChange,
  topics,
}: CreatePreviewQuizFormProps) {
  const [selectedTopics, setSelectedTopics] = useState<Topic2[]>([]);

  const params = useParams();
  const router = useRouter();

  const course_id = params.id;

  const handleToggleTopic = (topic: Topic2) => {
    let newSelection: Topic2[];
    const tId = parseInt(topic.id);

    if (selectedTopics.some((t) => t.id === topic.id)) {
      // 1. ลบออกจากรายการหัวข้อที่เลือก (Visual List)
      newSelection = selectedTopics.filter((t) => t.id !== topic.id);

      // 2. ลบข้อมูล Config ของหัวข้อนี้ออกจาก topicConfigs ทันที
      setTopicConfigs((prev) => prev.filter((t) => t.topic_id !== tId));
    } else {
      // เพิ่มหัวข้อใหม่
      newSelection = [...selectedTopics, topic];
      // (Optionally: คุณอาจจะยังไม่ต้องเพิ่มลงใน topicConfigs จนกว่าจะกด + Add ครั้งแรกก็ได้ครับ)
    }

    newSelection.sort((a, b) => {
      const indexA = topics.findIndex((t) => t.id === a.id);
      const indexB = topics.findIndex((t) => t.id === b.id);
      return indexA - indexB;
    });

    setSelectedTopics(newSelection);
  };

  const handleClearTopics = () => {
    // ล้างข้อมูลทั้ง 2 ส่วนให้เป็น Array ว่างทั้งหมด
    setSelectedTopics([]);
    setTopicConfigs([]);
  };

  // 1. กำหนด Interface ตามโครงสร้างที่ต้องการ
  interface QuizTypeConfig {
    type: "NORMAL_MULTIPLE" | "STATEMENT_VERIFICATION" | "STATEMENT_COUNTING";
    number: number;
  }

  interface DifficultyConfig {
    difficulty: "EASY" | "MEDIUM" | "HARD";
    quiz_type_config: QuizTypeConfig[];
  }

  interface TopicQuizConfig {
    topic_id: number;
    quiz_config: DifficultyConfig[];
  }

  // 2. ปรับ State ใน Component
  const [topicConfigs, setTopicConfigs] = useState<TopicQuizConfig[]>([]);
  // ฟังก์ชันสำหรับ Add แถวใหม่
  const handleAddConfig = (
    topicId: string,
    difficulty: "EASY" | "MEDIUM" | "HARD",
  ) => {
    const tId = parseInt(topicId);

    // ✅ แก้ไขที่ 1: ระบุประเภทให้ชัดเจน (Type Assertion)
    const defaultNewRow: QuizTypeConfig = {
      type: "NORMAL_MULTIPLE",
      number: 1,
    };

    setTopicConfigs((prev) => {
      const existingTopicIndex = prev.findIndex((t) => t.topic_id === tId);

      if (existingTopicIndex === -1) {
        return [
          ...prev,
          {
            topic_id: tId,
            quiz_config: [{ difficulty, quiz_type_config: [defaultNewRow] }],
          },
        ];
      }

      const newTopicConfigs = [...prev];
      const targetTopic = { ...newTopicConfigs[existingTopicIndex] };

      // ค้นหาระดับความยาก
      const difficultyIndex = targetTopic.quiz_config.findIndex(
        (d) => d.difficulty === difficulty,
      );

      if (difficultyIndex === -1) {
        // ✅ แก้ไขที่ 2: ใช้ค่าที่ระบุ Type แล้ว
        targetTopic.quiz_config = [
          ...targetTopic.quiz_config,
          { difficulty, quiz_type_config: [defaultNewRow] },
        ];
      } else {
        const targetDiff = { ...targetTopic.quiz_config[difficultyIndex] };
        // ✅ แก้ไขที่ 3: ใช้การกระจายอาเรย์แบบ Immutable พร้อมค่าที่ระบุ Type แล้ว
        targetDiff.quiz_type_config = [
          ...targetDiff.quiz_type_config,
          defaultNewRow,
        ];

        const newQuizConfig = [...targetTopic.quiz_config];
        newQuizConfig[difficultyIndex] = targetDiff;
        targetTopic.quiz_config = newQuizConfig;
      }

      newTopicConfigs[existingTopicIndex] = targetTopic;
      return newTopicConfigs;
    });
  };

  // ฟังก์ชันสำหรับ Update ค่า (Count หรือ Type)
  const handleUpdateConfig = (
    topicId: string,
    difficulty: "EASY" | "MEDIUM" | "HARD",
    index: number,
    field: "number" | "type",
    value: any,
  ) => {
    const tId = parseInt(topicId);
    setTopicConfigs((prev) => {
      const topic = prev.find((t) => t.topic_id === tId);
      const diff = topic?.quiz_config.find((d) => d.difficulty === difficulty);
      if (diff) {
        diff.quiz_type_config[index] = {
          ...diff.quiz_type_config[index],
          [field]: field === "number" ? parseInt(value) || 0 : value,
        };
      }
      return [...prev];
    });
  };
  // 3. ฟังก์ชันสำหรับลบแถว (ปรับปรุงใหม่ให้รองรับ Array Structure)
  const handleRemoveConfig = (
    topicId: string,
    difficulty: "EASY" | "MEDIUM" | "HARD",
    index: number,
  ) => {
    const tId = parseInt(topicId); // แปลง id เป็นตัวเลขเพื่อให้ตรงกับ TopicQuizConfig

    setTopicConfigs((prev) => {
      // ใช้ .map เพื่อสร้างอาเรย์ใหม่โดยไม่กระทบค่าเดิม (Immutability)
      return prev.map((topic) => {
        if (topic.topic_id !== tId) return topic;

        // ค้นหาและอัปเดตระดับความยากที่ต้องการลบแถว
        const updatedQuizConfig = topic.quiz_config.map((diffConfig) => {
          if (diffConfig.difficulty !== difficulty) return diffConfig;

          // ลบแถวตาม index ที่ระบุ พร้อมกำหนด Type ให้พารามิเตอร์เพื่อแก้ Error 'any'
          return {
            ...diffConfig,
            quiz_type_config: diffConfig.quiz_type_config.filter(
              (_: QuizTypeConfig, i: number) => i !== index,
            ),
          };
        });

        return {
          ...topic,
          quiz_config: updatedQuizConfig,
        };
      });
    });
  };
  const handleSubmit = async () => {
    // 1. นำข้อมูลจาก State มาทำการ Grouping ใหม่
    const processedPayload: TopicQuizConfig[] = topicConfigs.map((topic) => {
      return {
        ...topic,
        quiz_config: topic.quiz_config.map((diffConfig) => {
          // ใช้ Object เพื่อเก็บยอดรวมแยกตามประเภท (Type Mapping)
          const groupedTypes: { [key: string]: number } = {};

          diffConfig.quiz_type_config.forEach((config) => {
            if (groupedTypes[config.type]) {
              groupedTypes[config.type] += config.number; // รวมจำนวนข้อถ้าประเภทซ้ำกัน
            } else {
              groupedTypes[config.type] = config.number;
            }
          });

          // แปลงกลับเป็น Array ของ QuizTypeConfig ตามรูปแบบเดิม
          const mergedQuizTypeConfig: QuizTypeConfig[] = Object.entries(
            groupedTypes,
          ).map(([type, number]) => ({
            type: type as
              | "NORMAL_MULTIPLE"
              | "STATEMENT_VERIFICATION"
              | "STATEMENT_COUNTING",
            number,
          }));

          return {
            ...diffConfig,
            quiz_type_config: mergedQuizTypeConfig,
          };
        }),
      };
    });

    // 2. แสดงผลลัพธ์ข้อมูลที่รวมแล้ว
    // console.log("Combined Payload for API:", processedPayload);

    // 3. Logic การยิง API (ตัวอย่าง)
    try {
      const res = await createQuizPreview(processedPayload, course_id);
      if (res.ok) {
        stageChange();
      }
      router.push(`/course/${course_id}/quiz/preview?job=${res.job_id}`);
    } catch (error) {
      console.error("Failed to generate quiz", error);
    }
  };
  return (
    <div>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={stageChange} />
      <section className="bg-white border-1 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <Form action={handleSubmit}>
          <div className="flex flex-col">
            <div className="flex justify-between m-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Generate Quiz
                </h2>
                <p className="text-sm text-gray-500">
                  Select topics and set question types and amounts
                </p>
              </div>
              <button
                onClick={stageChange}
                className="text-gray-400 cursor-pointer hover:underline"
              >
                ✕
              </button>
            </div>
            <hr />
            <section className="m-5 max-h-[50vh] overflow-auto">
              <div className="flex justify-between px-5">
                <p className="font-bold text-gray-700">Select topic</p>
                <button
                  type="button"
                  onClick={handleClearTopics}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors cursor-pointer"
                >
                  clear
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 px-5">
                {/* map topics */}
                {topics?.map((topic, index) => {
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
                      <span>{topic.title}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col mt-3">
                {selectedTopics.map((topic, index) => {
                  return (
                    <div
                      key={index}
                      className="mx-5 my-2 border-1 rounded-lg overflow-hidden animate-in slide-in-from-bottom-2 duration-300"
                    >
                      <div
                        // onClick={() => console.log("click")}
                        className="bg-gray-200 p-5"
                      >
                        <span>{topic.title}</span>
                      </div>
                      {/* ตัวอย่างส่วนของ Easy Section */}
                      <div className="flex flex-col m-5 p-5 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-green-800 font-bold">
                            Easy (
                            {topicConfigs
                              .find((t) => t.topic_id === parseInt(topic.id))
                              ?.quiz_config.find((d) => d.difficulty === "EASY")
                              ?.quiz_type_config.reduce(
                                (acc: number, curr: QuizTypeConfig) =>
                                  acc + curr.number,
                                0,
                              ) || 0}{" "}
                            questions)
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAddConfig(topic.id, "EASY")}
                            className="bg-[#00B14F] hover:bg-[#009642] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>

                        {/* แสดงรายการที่ถูกเพิ่มเข้ามา */}
                        <div className="space-y-2">
                          {topicConfigs
                            .find((t) => t.topic_id === parseInt(topic.id))
                            ?.quiz_config.find((d) => d.difficulty === "EASY")
                            ?.quiz_type_config.map((config, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-200"
                              >
                                <input
                                  type="number"
                                  min="0"
                                  value={config.number}
                                  className="w-12 border rounded p-1 text-center font-bold"
                                  onChange={(e) =>
                                    handleUpdateConfig(
                                      topic.id,
                                      "EASY",
                                      idx,
                                      "number",
                                      e.target.value,
                                    )
                                  }
                                />
                                <span className="text-gray-400 text-sm">
                                  questions
                                </span>
                                <select
                                  value={config.type}
                                  className="flex-1 border rounded p-1 text-sm bg-gray-50 outline-none"
                                  onChange={(e) =>
                                    handleUpdateConfig(
                                      topic.id,
                                      "EASY",
                                      idx,
                                      "type",
                                      e.target.value as any,
                                    )
                                  }
                                >
                                  <option value="NORMAL_MULTIPLE">
                                    Standard Multiple Choice
                                  </option>
                                  <option value="STATEMENT_VERIFICATION">
                                    Statement Verification
                                  </option>
                                  <option value="STATEMENT_COUNTING">
                                    Statement Counting
                                  </option>
                                </select>
                                <button
                                  onClick={() =>
                                    handleRemoveConfig(topic.id, "EASY", idx)
                                  }
                                  className="text-red-500 text-sm font-semibold hover:text-red-700 px-2"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                      {/* 🟡 Medium Section */}
                      <div className="flex flex-col m-5 p-5 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-yellow-800 font-bold">
                            Medium (
                            {topicConfigs
                              .find((t) => t.topic_id === parseInt(topic.id))
                              ?.quiz_config.find(
                                (d) => d.difficulty === "MEDIUM",
                              )
                              ?.quiz_type_config.reduce(
                                (acc: number, curr: QuizTypeConfig) =>
                                  acc + curr.number,
                                0,
                              ) || 0}{" "}
                            questions)
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAddConfig(topic.id, "MEDIUM")}
                            className="bg-[#D4A017] hover:bg-[#B8860B] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>

                        <div className="space-y-2">
                          {topicConfigs
                            .find((t) => t.topic_id === parseInt(topic.id))
                            ?.quiz_config.find((d) => d.difficulty === "MEDIUM")
                            ?.quiz_type_config.map((config, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-200"
                              >
                                <input
                                  type="number"
                                  min="0"
                                  value={config.number}
                                  className="w-12 border rounded p-1 text-center font-bold"
                                  onChange={(e) =>
                                    handleUpdateConfig(
                                      topic.id,
                                      "MEDIUM",
                                      idx,
                                      "number",
                                      e.target.value,
                                    )
                                  }
                                />
                                <span className="text-gray-400 text-sm">
                                  questions
                                </span>
                                <select
                                  value={config.type}
                                  className="flex-1 border rounded p-1 text-sm bg-gray-50 outline-none"
                                  onChange={(e) =>
                                    handleUpdateConfig(
                                      topic.id,
                                      "MEDIUM",
                                      idx,
                                      "type",
                                      e.target.value as any,
                                    )
                                  }
                                >
                                  <option value="NORMAL_MULTIPLE">
                                    Standard Multiple Choice
                                  </option>
                                  <option value="STATEMENT_VERIFICATION">
                                    Statement Verification
                                  </option>
                                  <option value="STATEMENT_COUNTING">
                                    Statement Counting
                                  </option>
                                </select>
                                <button
                                  onClick={() =>
                                    handleRemoveConfig(topic.id, "MEDIUM", idx)
                                  }
                                  className="text-red-500 text-sm font-semibold hover:text-red-700 px-2"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* 🔴 Hard Section */}
                      <div className="flex flex-col m-5 p-5 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-red-800 font-bold">
                            Hard (
                            {topicConfigs
                              .find((t) => t.topic_id === parseInt(topic.id))
                              ?.quiz_config.find((d) => d.difficulty === "HARD")
                              ?.quiz_type_config.reduce(
                                (acc: number, curr: QuizTypeConfig) =>
                                  acc + curr.number,
                                0,
                              ) || 0}{" "}
                            questions)
                          </p>
                          <button
                            type="button"
                            onClick={() => handleAddConfig(topic.id, "HARD")}
                            className="bg-[#E50000] hover:bg-[#C40000] text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>

                        <div className="space-y-2">
                          {topicConfigs
                            .find((t) => t.topic_id === parseInt(topic.id))
                            ?.quiz_config.find((d) => d.difficulty === "HARD")
                            ?.quiz_type_config.map((config, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-200"
                              >
                                <input
                                  type="number"
                                  min="0"
                                  value={config.number}
                                  className="w-12 border rounded p-1 text-center font-bold"
                                  onChange={(e) =>
                                    handleUpdateConfig(
                                      topic.id,
                                      "HARD",
                                      idx,
                                      "number",
                                      e.target.value,
                                    )
                                  }
                                />
                                <span className="text-gray-400 text-sm">
                                  questions
                                </span>
                                <select
                                  value={config.type}
                                  className="flex-1 border rounded p-1 text-sm bg-gray-50 outline-none"
                                  onChange={(e) =>
                                    handleUpdateConfig(
                                      topic.id,
                                      "HARD",
                                      idx,
                                      "type",
                                      e.target.value as any,
                                    )
                                  }
                                >
                                  <option value="NORMAL_MULTIPLE">
                                    Standard Multiple Choice
                                  </option>
                                  <option value="STATEMENT_VERIFICATION">
                                    Statement Verification
                                  </option>
                                  <option value="STATEMENT_COUNTING">
                                    Statement Counting
                                  </option>
                                </select>
                                <button
                                  onClick={() =>
                                    handleRemoveConfig(topic.id, "HARD", idx)
                                  }
                                  className="text-red-500 text-sm font-semibold hover:text-red-700 px-2"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {selectedTopics.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                    Select at least one topic to start
                  </div>
                )}
              </div>
            </section>
            <hr />
            <div className="flex justify-end m-5">
              <button
                type="submit"
                disabled={selectedTopics.length === 0}
                className={`px-8 py-2.5 rounded-xl font-bold text-white transition-all cursor-pointer ${
                  selectedTopics.length > 0
                    ? "bg-blue-600 shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Generate Quiz
              </button>
            </div>
          </div>
        </Form>
      </section>
    </div>
  );
}

export function EditQuizMetaForm({
  quiz,
  setDataForm,
  stateChange,
}: EditQuizFormProps) {
  const handleUpdateQuiz = async (formData: FormData) => {
    const url = `${baseURL}/quizzes/${quiz.quiz_id}`;
    const token = await getToken();

    const sendData = {
      title: formData.get("title")?.toString() || quiz.title,
      solution_visibility:
        formData.get("visibility")?.toString() || quiz.solution_visibility,
      is_published: formData.get("isPublic") === "on",
    };

    try {
      if (!token) return alert("Please log in again.");

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "Application/json",
        },
        body: JSON.stringify(sendData),
      });

      if (res.ok) {
        const updatedData = await res.json();
        alert("Quiz updated successfully");
        setDataForm("title", sendData.title);
        setDataForm("is_published", sendData.is_published);
        setDataForm("solution_visibility", sendData.solution_visibility);
        stateChange();
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  const DeleteQuizHandler = async () => {
    const remove = confirm("do you want to delete this quiz");
    if (remove) {
      const url = `${baseURL}/quizzes/${quiz.quiz_id}`;
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
          alert("Successfully delet quiz");
          router.push(`/course/${quiz.course_id}`);
        } else {
          const errorText = await res.text();
          console.error("Delete failed:", errorText);
        }
      } catch (error: any) {
        console.error("error", error);
      }
    }
  };
  return (
    <section>
      <h2 className="text-xl font-bold">Edit Quiz Details</h2>
      <Form action={handleUpdateQuiz} className="flex flex-col mt-5 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Quiz Title</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={quiz.title}
            className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Solution Visibility
          </label>
          <select
            name="visibility"
            defaultValue={quiz.solution_visibility}
            className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALWAYS">ALWAYS (Show solutions after quiz)</option>
            <option value="NEVER">NEVER (Hide solutions)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            name="isPublic"
            type="checkbox"
            defaultChecked={quiz.is_published}
            className="rounded border-gray-300 accent-blue-600 w-4 h-4"
          />
          <span className="text-sm font-medium">Publish this quiz</span>
        </label>

        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition cursor-pointer"
          >
            Confirm
          </button>
          {/* <button
            type="button"
            onClick={DeleteQuizHandler}
            className="bg-red-500 text-white p-2 rounded-lg cursor-pointer hover:bg-red-600"
          >
            Delete
          </button> */}
          <button
            type="button"
            onClick={stateChange}
            className="bg-white text-gray-700 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </Form>
    </section>
  );
}

export function CreateFlashCardForm({
  stageChange,
  topics,
}: CreatePreviewFlashcardProps) {
  const [selectedTopics, setSelectedTopics] = useState<Topic2[]>([]);
  const [deckConfigs, setDeckConfigs] = useState<DeckTopicConfig[]>([]);

  const params = useParams();
  const router = useRouter();
  const course_id = params.id;

  // จัดการการเลือกหัวข้อ (Toggle Topic)
  const handleToggleTopic = (topic: Topic2) => {
    let newSelection: Topic2[];

    const tId = parseInt(topic.id);
    if (selectedTopics.some((t) => t.id === topic.id)) {
      // เอาออก
      newSelection = selectedTopics.filter((t) => t.id !== topic.id);
      setDeckConfigs((prev) => prev.filter((t) => t.topic_id !== tId));
    } else {
      // เพิ่มเข้า
      newSelection = [...selectedTopics, topic];
      setDeckConfigs((prev) => [...prev, { topic_id: tId, amount: 1 }]); // ค่าเริ่มต้น 5 ใบ
    }
    newSelection.sort((a, b) => {
      const indexA = topics.findIndex((t) => t.id === a.id);
      const indexB = topics.findIndex((t) => t.id === b.id);
      return indexA - indexB;
    });

    setSelectedTopics(newSelection);
  };

  const handleUpdateAmount = (topicId: string, value: string) => {
    const tId = parseInt(topicId);
    const amount = parseInt(value) || 0;
    setDeckConfigs((prev) =>
      prev.map((config) =>
        config.topic_id === tId ? { ...config, amount } : config,
      ),
    );
  };

  const handleClearTopics = () => {
    setSelectedTopics([]);
    setDeckConfigs([]);
  };

  const handleSubmit = async () => {
    try {
      const res = await createFlashcardPreview(deckConfigs, course_id);
      if (res.ok) {
        stageChange();
      }
      router.push(`/course/${course_id}/quiz/preview?job=${res.job_id}`);
    } catch (error) {
      console.error("Failed to generate flashcards", error);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={stageChange} />
      <section className="bg-white border rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <Form action={handleSubmit}>
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Generate Flashcards
                </h2>
                <p className="text-sm text-gray-500">
                  Select topics and set card amounts
                </p>
              </div>
              <button
                type="button"
                onClick={stageChange}
                className="text-gray-400 cursor-pointer hover:underline"
              >
                ✕
              </button>
            </div>

            <section className="m-5 max-h-[50vh] overflow-auto">
              <div className="flex justify-between px-5">
                <p className="font-bold text-gray-700">Select topic</p>
                <button
                  type="button"
                  onClick={handleClearTopics}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors cursor-pointer"
                >
                  clear
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mt-3 px-5">
                {/* map topics */}
                {topics?.map((topic, index) => {
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
                      <span>{topic.title}</span>
                    </div>
                  );
                })}
              </div>

              {/* Amount Configuration per Topic */}
              <div className="space-y-4 mt-3 px-5">
                {selectedTopics.map((topic) => {
                  const config = deckConfigs.find(
                    (c) => c.topic_id === parseInt(topic.id),
                  );
                  return (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-5 bg-gray-50 border border-gray-100 rounded-2xl animate-in slide-in-from-bottom-2 duration-300"
                    >
                      <span className="font-bold text-gray-800 mr-3">
                        {topic.title}
                      </span>

                      <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-xs font-bold text-gray-400 uppercase ml-2">
                          Amount
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={config?.amount || 0}
                          onChange={(e) =>
                            handleUpdateAmount(topic.id, e.target.value)
                          }
                          className="w-16 text-center font-mono font-bold text-blue-600 focus:outline-none"
                        />
                        <span className="text-xs font-bold text-gray-400 mr-2">
                          Cards
                        </span>
                      </div>
                    </div>
                  );
                })}

                {selectedTopics.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400">
                    Select at least one topic to start
                  </div>
                )}
              </div>
            </section>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                type="submit"
                disabled={selectedTopics.length === 0}
                className={`px-8 py-2.5 rounded-xl font-bold text-white transition-all cursor-pointer ${
                  selectedTopics.length > 0
                    ? "bg-blue-600 shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Generate Cards
              </button>
            </div>
          </div>
        </Form>
      </section>
    </div>
  );
}

export function EditDeckMetaForm({
  deck,
  setDataForm,
  stateChange,
}: EditDeckFormProps) {
  const handleUpdateQuiz = async (formData: FormData) => {
    const url = `${baseURL}/decks/${deck.deck_id}`;
    const token = await getToken();

    const sendData = {
      title: formData.get("title")?.toString() || deck.title,
      is_published: formData.get("isPublic") === "on",
    };

    try {
      if (!token) return alert("Please log in again.");

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "Application/json",
        },
        body: JSON.stringify(sendData),
      });

      if (res.ok) {
        const updatedData = await res.json();
        alert("Quiz updated successfully");
        setDataForm("title", sendData.title);
        setDataForm("is_published", sendData.is_published);
        stateChange();
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  return (
    <section>
      <h2 className="text-xl font-bold">Edit Quiz Details</h2>
      <Form action={handleUpdateQuiz} className="flex flex-col mt-5 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1">Quiz Title</label>
          <input
            name="title"
            type="text"
            required
            defaultValue={deck.title}
            className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            name="isPublic"
            type="checkbox"
            defaultChecked={deck.is_published}
            className="rounded border-gray-300 accent-blue-600 w-4 h-4"
          />
          <span className="text-sm font-medium">Publish this deck</span>
        </label>

        <div className="flex gap-4 mt-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition cursor-pointer"
          >
            Confirm
          </button>
          {/* <button
            type="button"
            onClick={DeleteQuizHandler}
            className="bg-red-500 text-white p-2 rounded-lg cursor-pointer hover:bg-red-600"
          >
            Delete
          </button> */}
          <button
            type="button"
            onClick={stateChange}
            className="bg-white text-gray-700 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </Form>
    </section>
  );
}
