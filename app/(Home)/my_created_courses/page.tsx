"use client";
import CoursesCard from "@/components/CoursesCard";
import { SearchBar } from "@/components/Searchbar";
import { useEffect, useState } from "react";
import { getPokemon } from "@/services/pokemon";
import { CreateCourseForm } from "@/components/Forms";
import { PaginationTemp } from "@/components/Pagination";
import { useSearchParams } from "next/navigation";

export default function MyCreatedCourses() {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState([]);
  const [createCourse, setCreateCourse] = useState(false);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  console.log("page :", page)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(search);
  };
  const handleCreateCourse = () => {
    setCreateCourse((prev)=>(!prev))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPokemon(page);
        console.log("Data loaded:", response.results);
        setData(response.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [page]);

  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      <div className="flex items-center">
        <h3 className="text-3xl font-bold">My Created Courses</h3>
        <button onClick={handleCreateCourse} className="ml-auto bg-blue-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-blue-600">+ Add Course</button>
      </div>
      <SearchBar
        search={search}
        handleSearch={handleSearch}
        setSearch={setSearch}
      />
      <div className="grid grid-cols-3 grid-flow-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {
          data.map((value:any, index)=> (
            <CoursesCard key={index} creator={value.name} description={value.url}/>
          ))
        }
      </div>
      {
        createCourse && (
          <CreateCourseForm stageChange={handleCreateCourse}/>
        )
      }
      <PaginationTemp page={page} pageSize={9} totalCount={100}/>
    </div>
  );
}