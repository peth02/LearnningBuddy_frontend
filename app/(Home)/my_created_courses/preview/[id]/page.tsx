"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCourseStore, Topic } from "@/lib/courseStore";

export default function TopicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getTopicById, updateTopic } = useCourseStore();

  const topicId = Number(params.id);
  const topic = getTopicById(topicId);

  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    summary_note: "",
    raw_text: ""
  });

  useEffect(() => {
    if (!topic) {
      router.push("/preview"); 
    } else {
      setFormData({
        title: topic.title,
        description: topic.description,
        summary_note: topic.summary_note,
        raw_text: topic.raw_text
      });
    }
  }, [topic, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!topic) return;
    const updatedTopicData: Topic = {
      order_index: topic.order_index,
      title: formData.title,
      description: formData.description,
      summary_note: formData.summary_note,
      raw_text: formData.raw_text
    };
    updateTopic(topicId, updatedTopicData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (topic) {
      setFormData({
        title: topic.title,
        description: topic.description,
        summary_note: topic.summary_note,
        raw_text: topic.raw_text
      });
    }
    setIsEditing(false);
  };

  if (!topic) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-10 flex justify-center pb-24">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        
        {/* --- Header Section --- */}
        <div className="bg-white border-b px-8 py-6 flex justify-between items-start">
          <div className="w-full">
            <button 
              onClick={() => router.back()} 
              className="text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm font-semibold transition"
            >
              ← Back to Course
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Topic {topicId}
              </span>
            </div>

            {isEditing ? (
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full text-3xl font-bold border-b-2 border-blue-500 outline-none pb-1 bg-gray-50 focus:bg-white transition"
                placeholder="Topic Title"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 break-words">{topic.title}</h1>
            )}
          </div>

          <div className="flex gap-2 shrink-0 ml-4">
            {isEditing ? (
              <>
                <button onClick={handleCancel} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md transition">
                  Save
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2 transition"
              >
                Edit Topic
              </button>
            )}
          </div>
        </div>

        {/* --- Body Content --- */}
        <div className="p-8 space-y-8">
            
          {/* 1. Description */}
          <section className="w-full">
            <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-2">Description</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50"
              />
            ) : (
              /* Added break-words to fix overflow */
              <p className="text-gray-700 text-lg leading-relaxed break-words w-full">
                {topic.description}
              </p>
            )}
          </section>

          <hr className="border-gray-100" />

          {/* 2. Summary Note (White Style) */}
          <section className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm w-full">
            <h3 className="text-gray-700 font-bold uppercase text-xs tracking-wider mb-3">
              Summary Note
            </h3>
            {isEditing ? (
              <textarea
                name="summary_note"
                value={formData.summary_note}
                onChange={handleChange}
                rows={6}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
              />
            ) : (
              /* Added break-words to fix overflow */
              <div className="prose prose-sm text-gray-700 whitespace-pre-line break-words w-full">
                {topic.summary_note || <span className="text-gray-400 italic">No summary added yet.</span>}
              </div>
            )}
          </section>

          {/* 3. Raw Text (White Style similar to Summary Note) */}
          <section className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm w-full">
            <h3 className="text-gray-700 font-bold uppercase text-xs tracking-wider mb-3">
              Original Content / Raw Text
            </h3>
            {isEditing ? (
              <textarea
                name="raw_text"
                value={formData.raw_text}
                onChange={handleChange}
                rows={8}
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-800 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            ) : (
              /* Changed to white bg, gray text, added break-words */
              <div className="text-gray-600 text-sm font-mono max-h-80 overflow-y-auto whitespace-pre-wrap break-words w-full">
                {topic.raw_text || "No raw text content available."}
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}