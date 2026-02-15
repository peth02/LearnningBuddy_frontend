"use client";
import { getCourseByID, getCourseTopics } from "@/services/course";
import { Course, Topic2 } from "@/types/Course";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function topicId() {
  const [data, setData] = useState<Course>();
  const [topics, setTopics] = useState<Topic2[]>();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const router = useRouter();
  const params = useParams();

  const id = params.id;
  const topic_id = params.topic_id;

  const handleEdit = () => {
    setIsEditing((prev)=>(!prev));
  }
  useEffect(() => {
    if (!id && !topic_id) {
      return;
    }
    const fetchData = async () => {
      try {
        const response = await getCourseByID(id);
        console.log("Data loaded:", response);
        setData(response);

        const response2 = await getCourseTopics(id);
        console.log("Data loaded:", response2);
        setTopics(response2.topics);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id, topic_id]);

  return (
    <div className="flex flex-col min-h-screen  gap-7 py-10 px-20 bg-gray-100">
      <section className="bg-white rounded-lg shadow-sm p-10">
        <div className="flex">
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-blue-600 mb-4 flex items-center gap-2 text-sm font-semibold transition"
          >
            ← Back to Course
          </button>
          {data?.is_owner ? (
            <a
              onClick={handleEdit}
              className="ml-auto cursor-pointer h-fit text-gray-600 underline"
            >
              Edit
            </a>
          ) : null}
        </div>
        {!isEditing ? (
          <div>
            <h2>{data?.title}</h2>
            {topics
              ?.filter((t) => t.id == topic_id)
              .map((t, index) => (
                <div key={index}>
                  <div>{t.title}</div>
                  <div>{t.summary_note}</div>
                </div>
              ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
