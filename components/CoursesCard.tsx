import { CourseMetaData } from "@/types/Course";
import Link from "next/link";

export default function CoursesCard(
  { id, title, description, is_published, totalTopics }: CourseMetaData,
  creator?: boolean,
) {
  return (
    /* ✅ เพิ่ม border-gray-200 และ shadow-md เพื่อสร้างระยะแยกจากพื้นหลังสีขาว */
    <div className="flex flex-col max-w-full h-full p-6 gap-5 bg-white rounded-3xl border border-gray-200 shadow-md hover:shadow-2xl hover:border-blue-300 transition-all duration-300 group relative overflow-hidden">
      
      {/* 🏷️ Status Badge: ปรับให้ชัดเจนขึ้น */}
      <div className="flex justify-between items-start gap-4">
        <h4 className="text-lg font-black text-gray-900 uppercase leading-tight">
          {title}
        </h4>
        {is_published ? (
          <span className="shrink-0 text-[10px] font-black uppercase px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full shadow-sm">
            Public
          </span>
        ) : (
          <span className="shrink-0 text-[10px] font-black uppercase px-3 py-1 bg-gray-100 text-gray-500 border border-gray-200 rounded-full shadow-sm">
            Private
          </span>
        )}
      </div>

      {/* 📝 Description: เพิ่มความเข้มของสีฟอนต์เล็กน้อยเพื่อการอ่านที่ง่ายขึ้น */}
      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed flex-1">
        {description || "No description provided for this course."}
      </p>

      {/* 📊 Metadata Area */}
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          <span className="text-xs font-black uppercase tracking-wider">{totalTopics} Topics</span>
        </div>
      </div>

      {/* 🔗 Action Button: ใช้สีน้ำเงินเข้มและเงาเพื่อให้ปุ่มดูคลิกได้จริง */}
      <Link
        href={`/course/${id}`}
        className="w-full bg-blue-600 text-white font-black py-3.5 rounded-2xl text-center shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] transition-all duration-200 uppercase text-sm tracking-wide"
      >
        View Course
      </Link>
    </div>
  );
}