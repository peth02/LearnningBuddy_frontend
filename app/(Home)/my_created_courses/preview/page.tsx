"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCourseStore, Topic } from "@/lib/courseStore";
import { useStore } from "@/hooks/useStore";

export default function Preview() {
  const router = useRouter();

  // เรียก Actions จาก Store
  const course = useStore(useCourseStore, (state) => state.course);
  const { addTopic, removeTopic, updateCourseInfo } = useCourseStore();

  // State สำหรับ Form (Title/Description)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // 1. Load ข้อมูลจาก Store เมื่อเข้าหน้าเว็บ
  // เพิ่ม State เพื่อเช็คว่าโหลดข้อมูลจาก LocalStorage เสร็จหรือยัง
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่า useStore ดึงข้อมูลเสร็จหรือยัง (ไม่ใช่ undefined)
    if (course !== undefined) {
      if (course === null) {
        // ถ้าโหลดเสร็จแล้วแต่ข้อมูลยังเป็น null จริงๆ ให้ Redirect
        router.push("/my_created_courses");
      } else {
        // ถ้ามีข้อมูล ให้ตั้งค่า State และบอกว่าพร้อมแสดงผล
        setTitle(course.title);
        setDesc(course.description);
        setIsReady(true);
      }
    }
  }, [course, router]);

  // 2. ฟังก์ชัน Update Store เมื่อแก้ไข Title/Desc (ใช้ onBlur เพื่อไม่ให้ update ถี่เกินไป)
  const handleUpdateInfo = () => {
    updateCourseInfo(title, desc);
  };

  // 3. ฟังก์ชัน Add Topic
  const handleAddTopic = () => {
    // หา ID สูงสุดปัจจุบัน + 1 (หรือเริ่มที่ 1)
    const currentTopics = course?.topics || [];
    const maxId =
      currentTopics.length > 0
        ? Math.max(...currentTopics.map((t) => t.order_index))
        : 0;

    const newTopic: Topic = {
      order_index: maxId + 1,
      title: "New Topic",
      description: "Description",
      raw_text: "",
      summary_note: "",
    };

    addTopic(newTopic);
  };

  // 4. ฟังก์ชัน Delete Topic
  const handleDelTopic = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // ⚠️ สำคัญ: ป้องกันไม่ให้ Event คลิกทะลุไป trigger การเปลี่ยนหน้า
    if (confirm("Are you sure you want to delete this topic?")) {
      removeTopic(id);
    }
  };

  // 5. ฟังก์ชันเปลี่ยนหน้า (ไป Page 3)
  const handleNavigateToTopic = (id: number) => {
    router.push(`/my_created_courses/preview/${id}`); // เปลี่ยน path ตามที่คุณตั้งไว้
  };

  const handleCancel = () => {
    router.push(`/my_created_courses`);
  };
  // 6. ฟังก์ชันปุ่ม Final Create (Footer)
  const handleFinalCreate = () => {
    // ตรงนี้คือจุดที่คุณจะยิง API ไป Backend
    console.log("Ready to send to API:", course);
    alert(
      `Course "${course?.title}" Created with ${course?.topics.length} topics!`,
    );
  };

  if (!isReady || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen gap-7 bg-gray-100 pb-24">
      {" "}
      {/* pb-24 เพื่อกันเนื้อหาโดน Footer บัง */}
      {/* Section 1: Course Info Form */}
      <section className="bg-white rounded-lg shadow-sm p-10 mx-20 my-10">
        <div className="flex flex-col gap-4">
          <div>
            <label className="font-bold text-gray-700">Course Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleUpdateInfo} // Update Store เมื่อพิมพ์เสร็จแล้วคลิกออก
              className="mt-1 flex h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-gray-700">Description</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={handleUpdateInfo}
              className="mt-1 flex h-11 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </section>
      {/* Section 2: Topics List */}
      <section className="bg-white rounded-lg shadow-sm mx-20 ">
        <div className="p-10">
          <div className="flex justify-start mb-5">
            <button
              onClick={handleAddTopic}
              className="bg-blue-500 text-white font-bold p-2 px-4 rounded-lg hover:bg-blue-600 transition shadow-md"
            >
              + Add Topic
            </button>
          </div>

          <div className="flex flex-col gap-4 max-w-[1400px]">
            {course.topics.length === 0 && (
              <div className="text-center text-gray-400 py-10">
                No topics yet. Click Add Topic to start.
              </div>
            )}

            {course.topics.map((topic, index) => (
              <section
                key={topic.order_index}
                // คลิกที่การ์ดแล้วไปหน้า Topic Detail
                onClick={() => handleNavigateToTopic(topic.order_index)}
                className="bg-white rounded-lg border-2 border-gray-200 px-10 py-7 min-h-[100px] hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex gap-5 items-start">
                  <div className="font-bold text-gray-400 text-xl shrink-0 group-hover:text-blue-500">
                    #{index + 1}
                  </div>

                  <div className="flex flex-col flex-1 min-w-0 gap-1">
                    <div className="font-bold text-lg text-gray-800">
                      {topic.title}
                    </div>
                    <div className="break-words text-gray-600 line-clamp-2">
                      {topic.description}
                    </div>
                  </div>

                  <div className="ml-auto shrink-0 flex gap-2 items-center">
                    {/* ปุ่ม Delete */}
                    <button
                      onClick={(e) => handleDelTopic(e, topic.order_index)}
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                      title="Delete Topic"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
      {/* Section 3: Bottom Bar */}
      <section className="fixed bottom-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] h-20 z-50 border-t border-gray-200 px-10 flex items-center">
        <div className="max-w-screen-xl mx-auto w-full flex items-center justify-end gap-10">
          <div className="text-gray-500 font-medium">
            Total Topics:{" "}
            <span className="text-black font-bold">{course.topics.length}</span>
          </div>
          <button onClick={handleCancel}>cancel</button>
          <button
            onClick={handleFinalCreate}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition"
          >
            Save & Create Course
          </button>
        </div>
      </section>
    </div>
  );
}
