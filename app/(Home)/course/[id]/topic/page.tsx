"use client";
import Editor from "@/components/Editor";
import { CourseTopicsNav } from "@/components/Navbar";
import {
  getCourseByID,
  getCourseTopics,
  updateCourseTopic,
} from "@/services/course";
import { Course, Topic2 } from "@/types/Course";
import { UpdateCourseTopicsProps } from "@/types/Form";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function topicId() {
  const [data, setData] = useState<Course>();
  const [topics, setTopics] = useState<Topic2[]>();
  const [editTopics, setEditTopics] = useState<UpdateCourseTopicsProps[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;
  let topic_id = searchParams.get("topic") || null;

  // 1. Get current index from URL (offset by -1 for array index)
  const currentTopicIndex = parseInt(searchParams.get("topic") || "1") - 1;

  // 2. Identify the current object
  const currentTopic = editTopics[currentTopicIndex];

  // 3. Handler for updating any field in the current topic
  const handleTopicUpdate = (
    field: keyof UpdateCourseTopicsProps,
    value: string,
  ) => {
    setIsEdit(true);
    setEditTopics((prev) => {
      const updated = [...prev];
      if (updated[currentTopicIndex]) {
        updated[currentTopicIndex] = {
          ...updated[currentTopicIndex],
          [field]: value,
        };
      }
      return updated;
    });
  };
  // 4. Update the specific topic in the list
  const handleEditorChange = (newValue: string) => {
    setIsEdit(true);
    setEditTopics((prev) => {
      const updated = [...prev];
      if (updated[currentTopicIndex]) {
        updated[currentTopicIndex] = {
          ...updated[currentTopicIndex],
          summary_note: newValue,
        };
      }
      return updated;
    });
  };

  const handleAddTopic = () => {
    setIsEdit(true);
    const newIndex = editTopics.length + 1;
    const newTopic: UpdateCourseTopicsProps = {
      // If your type requires an ID, use a temp one or cast 'temp'
      title: `New Topic ${newIndex}`,
      order_index: newIndex.toString(),
      description: "",
      raw_text: `New Topic raw text ${newIndex}`,
      summary_note: `## new topic ${newIndex}`,
    };

    setEditTopics((prev) => [...prev, newTopic]);
    router.push(`?topic=${newIndex}`, { scroll: false });
  };
  const handleDeleteTopic = (indexToDelete: number) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) return;
    setIsEdit(true);
    setEditTopics((prev) => {
      const updated = prev.filter((_, i) => i !== indexToDelete);

      // Logic: If we deleted the current topic or one before it, we need to adjust the URL
      const currentActive = parseInt(searchParams.get("topic") || "1");

      if (currentActive > updated.length) {
        // If we deleted the last item and we were on it, go to the new last item
        router.push(`?topic=${Math.max(1, updated.length)}`, { scroll: false });
      } else if (currentActive > indexToDelete + 1) {
        // If we deleted an item BEFORE our current one, shift index down by 1
        router.push(`?topic=${currentActive - 1}`, { scroll: false });
      }

      return updated;
    });
  };
  const handleCancle = () => {
    // 1. Optional: Ask for confirmation so they don't lose work by accident
    const confirmCancel = window.confirm(
      "Are you sure you want to discard all changes?",
    );
    setIsEdit(false);

    if (confirmCancel) {
      // 2. Reset the editable state back to the original data from the server
      setEditTopics(topics || []);
      // 3. Reset the URL to the first topic to avoid "index out of bounds" errors
      // if the user had added new topics and was currently viewing one.
      router.push("?topic=1", { scroll: false });
    }
  };
  const handleUpdateSubmit = async () => {
    const res = await updateCourseTopic(id, editTopics);
    if (res) {
      window.alert(res.message);
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (!id && !topic_id) {
      return;
    }
    const fetchDataCourse = async () => {
      try {
        const response = await getCourseByID(id);
        // console.log("Data loaded:", response);
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchDataTopic = async () => {
      try {
        const response = await getCourseTopics(id);
        // console.log("Data2 loaded:", response);
        setTopics(response.topics);
        setEditTopics(response.topics);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDataCourse();
    fetchDataTopic();
    // console.log(data)
    // console.log(topics)
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="px-20 py-10">
        <section className="bg-white rounded-lg shadow-sm p-10">
          {data ? (
            <div className="flex-col grow-0 w-full">
              <button
                onClick={() => router.push(`/course/${id}`)}
                className="text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm font-semibold transition cursor-pointer"
              >
                ← Back to Course
              </button>
              <div className=" text-m text-wrap w-full">
                <h2 className="text-xl font-bold uppercase break-all mr-20">
                  {data.title}
                </h2>
                <div className="mt-7">
                  <h3 className="font-semibold">Description :</h3>
                  <div className="text-gray-800 break-all mr-20">
                    {data.description}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </section>
        <section className="flex flex-1 mt-10 gap-10">
          <nav className="flex flex-col h-fit mx-auto bg-white rounded-lg shadow-sm py-10 px-5 max-h-200 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <h3 className="font-semibold w-[400px]">Topics</h3>
            {data &&
              editTopics?.map((topic, index) => (
                <CourseTopicsNav
                  key={index}
                  index={(index + 1).toString()}
                  label={topic.title}
                  showDelete={data?.is_owner}
                  onDelete={handleDeleteTopic}
                />
              ))}
            {data?.is_owner && (
              <button
                className="bg-blue-500 text-white font-bold px-4 py-2.5 max-w-[300] rounded-lg text-center cursor-pointer"
                onClick={handleAddTopic}
              >
                + Add topic
              </button>
            )}
          </nav>
          <div className="w-full bg-white rounded-lg shadow-sm p-10">
            {data?.is_owner ? (
              <>
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
                    key={currentTopicIndex}
                    initialContent={currentTopic?.summary_note}
                    onChange={handleEditorChange}
                    isEdible={data?.is_owner || false}
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
              </>
            ) : (
              <>
                <h3 className="text-2xl text-gray-800 break-all">
                  {currentTopic?.title}
                </h3>
                <h4 className="text-l text-gray-800 break-all my-5">
                  {currentTopic?.description}
                </h4>
                <label className="font-semibold mb-5">Summary Note</label>
                {editTopics.length > 0 && (
                  <Editor
                    key={currentTopicIndex}
                    initialContent={currentTopic?.summary_note}
                    onChange={handleEditorChange}
                    isEdible={data?.is_owner || false}
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
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-600 text-sm">
                        ${currentTopic?.raw_text}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
      {data?.is_owner && isEdit && (
        <div className="mt-auto flex justify-end items-center px-20 py-5 gap-10 bg-white">
          <div>Save Change?</div>
          <button
            className="rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 cursor-pointer"
            onClick={handleCancle}
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
