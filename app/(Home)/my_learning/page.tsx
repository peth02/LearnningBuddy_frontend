"use client";
import CoursesCard from "@/components/CoursesCard";
import { SearchBar } from "@/components/Searchbar";
import { getMyEnrolledCourses } from "@/services/course";
import { CourseMetaData } from "@/types/Course";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyLearning() {
  const router = useRouter();

  const [search, setSearch] = useState<string>("");
  const [datas, setDatas] = useState([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = `?search=${search}`;
        const response = await getMyEnrolledCourses(params);
        setDatas(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      <div className="h-[800px] space-y-10 p-10 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-500">
        <h3 className="text-3xl font-bold">My Learning</h3>
        {/* <SearchBar
        search={search}
        handleSearch={handleSearch}
        setSearch={setSearch}
      /> */}
        <div className="grid grid-cols-3 grid-flow-2 gap-4">
          {datas &&
            datas.map((data: CourseMetaData, index) => (
              <CoursesCard
                key={index}
                id={data.id}
                title={data.title}
                description={data.description}
                is_published={data.is_published}
                totalTopics={data.totalTopics}
              />
            ))}
          {datas.length <= 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-500">
              {/* Icon Container */}
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>

              {/* Text Content */}
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                No courses found
              </h4>
              <p className="text-gray-400 text-center max-w-xs leading-relaxed">
                You haven't enrolled in any courses yet. Start your learning
                journey by exploring available courses.
              </p>

              {/* Optional Action Button */}
              <button
                onClick={() => router.push("/home")} // ปรับ path ตามหน้า Explore ของคุณ
                className="mt-8 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 cursor-pointer"
              >
                Explore Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
