"use client";
import CoursesCard from "@/components/CoursesCard";
import { SearchBar } from "@/components/Searchbar";
import { useEffect, useState } from "react";
import { CreatePreviewCourseForm } from "@/components/Forms";
import { PaginationTemp } from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import { CourseMetaData } from "@/types/Course";
import { getMyCreatedCourses } from "@/services/course";
import { CourseHistoryModal } from "@/components/ShowJobs";

export default function MyCreatedCourses() {
  const [search, setSearch] = useState<string>("");
  const [datas, setDatas] = useState([]);
  const [createCourse, setCreateCourse] = useState(false);
  const [showCourseJobs, setShowCourseJobs] = useState(false);

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleCreateCourse = () => {
    setCreateCourse((prev) => !prev);
  };
  const handleShowCourseJobs = () => {
    setShowCourseJobs((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = `?search=${search}`;
        const response = await getMyCreatedCourses(params);
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
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-bold">My Created Courses</h3>
          <div className="space-x-10">
            <button
              onClick={handleCreateCourse}
              className="ml-auto bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
            >
              + Add Course
            </button>
            <button
              onClick={handleShowCourseJobs}
              className="ml-auto bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600"
            >
              Generated History
            </button>
          </div>
        </div>
        {/* <SearchBar
          search={search}
          handleSearch={handleSearch}
          setSearch={setSearch}
        /> */}
        <div className="grid grid-cols-3 grid-flow-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {datas.length > 0 ? (
            datas.map((data: CourseMetaData, index) => (
              <CoursesCard
                key={index}
                id={data.id}
                title={data.title}
                description={data.description}
                is_published={data.is_published}
                totalTopics={data.totalTopics}
              />
            ))
          ) : (
            /* 📌 Empty State เมื่อยังไม่มีคอร์สที่สร้าง */
            <div className="col-span-full flex flex-col items-center justify-center py-24">
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
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>

              <h4 className="text-xl font-bold text-gray-800 mb-2">
                No created courses yet
              </h4>
              <p className="text-gray-400 text-center max-w-xs leading-relaxed mb-8">
                You haven't created any courses. Start building your learning
                materials by adding your first course.
              </p>
            </div>
          )}
        </div>
      </div>
      {createCourse && (
        <CreatePreviewCourseForm stageChange={handleCreateCourse} />
      )}
      {showCourseJobs && <CourseHistoryModal setStage={handleShowCourseJobs} />}
      {/* <div className="justify-items-center">
        <PaginationTemp page={page} pageSize={9} totalCount={100}/>
      </div> */}
    </div>
  );
}
