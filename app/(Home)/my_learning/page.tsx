"use client";
import CoursesCard from "@/components/CoursesCard";
import { SearchBar } from "@/components/Searchbar";
import { useEffect, useState } from "react";
import { getPokemon } from "@/services/pokemon";

export default function MyLearning() {
  const [search, setSearch] = useState<string>("");
  const [data, setData] = useState([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(search);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPokemon();
        console.log("Data loaded:", response.results);
        setData(response.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen gap-7 py-10 px-20 bg-gray-100">
      <h3 className="text-3xl font-bold">My Learning</h3>
      <SearchBar
        search={search}
        handleSearch={handleSearch}
        setSearch={setSearch}
      />
      <div className="grid grid-cols-3 grid-flow-2 gap-4">
        {
          data.map((value:any, index)=> (
            <CoursesCard key={index} creator={value.name} description={value.url}/>
          ))
        }
      </div>
    </div>
  );
}