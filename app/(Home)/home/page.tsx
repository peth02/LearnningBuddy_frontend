"use client";
import CoursesCard from "@/components/CoursesCard";
import { SearchBar } from "@/components/Searchbar";
import { useEffect, useState } from "react";
import { getCourses } from "@/services/course";
import { CourseMetaData } from "@/types/Course";

export default function Home() {
  const [search, setSearch] = useState<string>("");
  const [datas, setDatas] = useState([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let params = `?search=${search}`;
        const response = await getCourses(params);
        setDatas(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      <div className="min-h-[850px] space-y-10 p-10 bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-500">
        <h3 className="text-3xl font-bold">Explore Courses</h3>
        <SearchBar
          search={search}
          handleSearch={handleSearch}
          setSearch={setSearch}
        />
        <div className="grid grid-cols-3 grid-flow-2 gap-4">
          {datas.map((data: CourseMetaData, index) => (
            <CoursesCard
              key={index}
              id={data.id}
              title={data.title}
              description={data.description}
              is_published={data.is_published}
              totalTopics={data.totalTopics}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
