"use client";
import CoursesCard from "@/components/CoursesCard";
import { SearchBar } from "@/components/Searchbar";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(search);
  };
  return (
    <div className="flex flex-col min-h-screen gap-5 py-10 px-20 bg-gray-100">
      <h3 className="text-3xl font-bold">Explore Courses</h3>
      <SearchBar
        search={search}
        handleSearch={handleSearch}
        setSearch={setSearch}
      />
      <div className="grid grid-cols-3 grid-flow-2">
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
        <CoursesCard creator={1}/>
      </div>
    </div>
  );
}
