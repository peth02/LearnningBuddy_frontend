"use client"
import { SearchBar } from "@/components/Searchbar";
import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    console.log(search)
  }
  return (
    <div className="flex min-h-screen flex-col gap-5 p-24">
      <h1>Explore Courses</h1>
      <SearchBar search={search} handleSearch={handleSearch} setSearch={setSearch}/>
      <div>items</div>
    </div>
  );
}
