"use client";

import Editor from "@/components/Editor";
import { CourseTopicsNav, CourseTopicsPreviewNav } from "@/components/Navbar";
import { createCourseFromPreview, getCoursePreviewByJobId } from "@/services/course";
import { CourseMetaData, PreviewCourseResponse, Topic3 } from "@/types/Course";
import { UpdateCourseTopicsProps } from "@/types/Form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviewCourse() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const job_id = searchParams.get("job") || null;

  const [loadingData, setLoadingData] = useState<PreviewCourseResponse>({
    job_id: job_id || "",
    status: "QUEUED",
  });
  const [courseMetaData, setCourseMetaData] = useState<CourseMetaData>({
    title: `Deck ${job_id ? job_id.slice(0, 10) : ""}`,
    description: "description",
    is_published: true,
  });
  const [topics, setTopics] = useState<Topic3[]>([]);
  const [editTopics, setEditTopics] = useState<Topic3[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const currentTIndex = parseInt(searchParams.get("t") || "1") - 1;
  const currentTopic = editTopics[currentTIndex];

  const handleMetaChange = (
    field: keyof CourseMetaData,
    value: string | boolean,
  ) => {
    setCourseMetaData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTopicUpdate = (
    field: keyof UpdateCourseTopicsProps,
    value: string,
  ) => {
    setEditTopics((prev) => {
      const updated = [...prev];
      if (updated[currentTIndex]) {
        updated[currentTIndex] = {
          ...updated[currentTIndex],
          [field]: value,
        };
      }
      return updated;
    });
  };
  // 4. Update the specific topic in the list
  const handleEditorChange = (newValue: string) => {
    setEditTopics((prev) => {
      const updated = [...prev];
      if (updated[currentTIndex]) {
        updated[currentTIndex] = {
          ...updated[currentTIndex],
          summary_note: newValue,
        };
      }
      return updated;
    });
  };
  const handleAddTopic = () => {
    const newIndex = editTopics.length + 1;
    const newTopic: UpdateCourseTopicsProps = {
      // If your type requires an ID, use a temp one or cast 'temp'
      order_index: newIndex.toString(),
      title: `New Topic ${newIndex}`,
      description: "",
      raw_text: `New Topic raw text ${newIndex}`,
      summary_note: `## new topic ${newIndex}`,
    };

    setEditTopics((prev) => [...prev, newTopic]);
    router.push(`?job=${job_id}&t=${newIndex}`, { scroll: false });
  };

  const handleDeleteTopic = (indexToDelete: number) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    setEditTopics((prev) => {
      const updated = prev.filter((_, i) => i !== indexToDelete);

      // Logic: If we deleted the current topic or one before it, we need to adjust the URL
      const currentActive = parseInt(searchParams.get("t") || "1");

      if (currentActive > updated.length) {
        // If we deleted the last item and we were on it, go to the new last item
        router.push(`?job=${job_id}&t=${Math.max(1, updated.length)}`, {
          scroll: false,
        });
      } else if (currentActive > indexToDelete + 1) {
        // If we deleted an item BEFORE our current one, shift index down by 1
        router.push(`?job=${job_id}&t=${currentActive - 1}`, { scroll: false });
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await createCourseFromPreview(
        courseMetaData,
        editTopics,
      );
      router.push(`/course/${res.course_id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!job_id) return;
    const checkProgress = setInterval(async () => {
      try {
        const res = await getCoursePreviewByJobId(job_id);
        setLoadingData(res);
        if (res.status == "COMPLETED") {
          clearInterval(checkProgress);
          setCourseMetaData({
            title: res.result.title,
            description: res.result.description,
            is_published: true,
          });
          setTopics(res.result.topics);
          setEditTopics(res.result.topics);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 20000); // 20 seconde

    return () => clearInterval(checkProgress);
  }, [job_id]);

  if (loadingData.status == "QUEUED" || loadingData.status == "PROCESSING") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-20 py-10">
        <div className="bg-gray-100 flex flex-col items-center justify-center p-10">
          <div className="max-w-lg w-full text-center bg-white p-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in zoom-in duration-500">
            <div className="mb-8 flex justify-center">
              {/* <div className="relative">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.394l-1.154.908a2 2 0 01-3.147-1.458V5.272a2 2 0 011.242-1.844l6.162-2.465a4 4 0 012.592 0l6.162 2.465a2 2 0 011.242 1.844v9.612a2 2 0 01-1.108 1.782l-1.154.577z"
                    />
                  </svg>
                </div>
              </div> */}
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Generating Your Course
            </h2>
            <p className="text-gray-500 mb-10 text-lg">
              Our AI is crafting custom topics based on your pdf file.
              <br />
              {/* <span className="text-sm italic text-gray-400">
                This usually takes less than a minute.
              </span> */}
            </p>

            {/* Progress Bar Container */}
            {/* <div className="relative pt-1">
              <div className="flex justify-center mb-3 items-center justify-between">
                <div className="text-right">
                  <span className="text-sm font-bold inline-block text-blue-600 font-mono">
                    {loadingData.progress_percent}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner">
                <div
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-700 ease-in-out relative overflow-hidden"
                  style={{ width: `${loadingData.progress_percent}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div> */}

            <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
              <div
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
              <span className="text-sm font-medium ml-2">
                AI is thinking...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (loadingData.status == "FAILED") {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100 items-center justify-center p-10">
        <div className="max-w-md w-full text-center bg-white p-12 rounded-3xl shadow-lg border border-red-100 animate-in fade-in zoom-in duration-300">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-500"
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
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Generation Failed
          </h2>
          <p className="text-gray-500 mb-8">
            Something went wrong while creating your deck. Please try again or
            check your topics.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/my_created_courses`)}
              className="w-full bg-white text-gray-600 font-semibold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="px-20 py-10">
        <section className="bg-white rounded-lg shadow-sm p-10 flex flex-col gap-5">
          <button
            onClick={() => router.push(`/my_created_courses`)}
            className="mr-auto text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm font-semibold transition cursor-pointer"
          >
            ← Back to Courses
          </button>
          <div>
            <label className="block font-semibold mb-3 text-gray-800">
              Course Title
            </label>
            <input
              name="title"
              type="text"
              required
              value={courseMetaData.title}
              onChange={(e) => handleMetaChange("title", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-3 text-gray-800">
              Course Description
            </label>
            <input
              name="description"
              type="text"
              required
              value={courseMetaData.description}
              onChange={(e) => handleMetaChange("description", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input
              name="isPublic"
              type="checkbox"
              // ✅ ใช้ checked แทน defaultChecked สำหรับ controlled component
              checked={courseMetaData.is_published}
              onChange={(e) =>
                handleMetaChange("is_published", e.target.checked)
              }
              className="rounded border-gray-300 accent-blue-600 w-4 h-4"
            />
            <span className="text-gray-800">Publish this quiz</span>
          </label>
        </section>
        <section className="flex flex-1 mt-10 gap-10">
          <nav className="flex flex-col h-fit mx-auto bg-white rounded-lg shadow-sm py-10 px-5 max-h-200 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <h3 className="font-semibold w-[200px]">Topics</h3>
            {job_id &&
              editTopics?.map((topic, index) => (
                <CourseTopicsPreviewNav
                  key={index}
                  job_id={job_id}
                  index={(index + 1).toString()}
                  label={topic.title}
                  showDelete={true}
                  onDelete={handleDeleteTopic}
                />
              ))}
            <button
              className="bg-blue-500 text-white font-bold px-4 py-2.5 max-w-[200] rounded-lg text-center cursor-pointer"
              onClick={handleAddTopic}
            >
              + Add topic
            </button>
          </nav>

          <div className="w-full bg-white rounded-lg shadow-sm p-10">
            <div>
              <label className=" font-semibold mb-1">Title</label>
              <input
                type="text"
                value={currentTopic?.title || ""}
                onChange={(e) => handleTopicUpdate("title", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter topic title..."
              />
            </div>
            <div>
              <label className=" font-semibold mb-1">Description</label>
              <textarea
                value={currentTopic?.description || ""}
                onChange={(e) =>
                  handleTopicUpdate("description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24"
                placeholder="Enter topic description"
              />
            </div>
            <label className="font-semibold mb-5">Summary Note</label>
            {editTopics.length > 0 && (
              <Editor
                key={currentTIndex}
                initialContent={currentTopic?.summary_note}
                onChange={handleEditorChange}
                isEdible={true}
              />
            )}
            {/* raw text */}
            <div className="w-full">
              <div
                className="flex items-center cursor-pointer select-none group"
                onClick={() => setIsOpen(!isOpen)}
              >
                <label className="font-semibold mr-2 cursor-pointer">
                  Raw text
                </label>

                {/* CSS-only Arrow */}
                <span
                  className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                >
                  ▼
                </span>
              </div>

              {/* Content Div */}
              <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "opacity-100 mt-4" : "max-h-0 opacity-0"}`}
              >
                <textarea
                  defaultValue={currentTopic?.raw_text}
                  onChange={(e) =>
                    handleTopicUpdate("raw_text", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-40"
                  placeholder="Enter topic raw text"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="mt-auto flex justify-end items-center px-20 py-5 gap-10 bg-white">
        <div>Create Course?</div>
        {/* <button
            className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 cursor-pointer"
            onClick={handleCancel}
          >
            Cancle
          </button> */}
        <button
          className="bg-blue-500 text-white font-bold px-4 py-2.5 rounded-lg text-center cursor-pointer"
          onClick={handleSubmit}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
