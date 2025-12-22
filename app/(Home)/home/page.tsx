"use client"
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
      <div className="flex border border-gray-300 rounded-lg px-5 w-full gap-5">
        <div className="py-2">icon</div>
        <input
          type="text"
          placeholder="Search..."
          className="outline-none py-2 w-full"
          value={search}
          onChange={handleSearch}
        />
        {
          search ? (
            <div className="py-2" onClick={()=>{setSearch("")}}>delete</div>
          ) : (
            <></>
          )
        }
      </div>
      <div>items</div>
    </div>
  );
}
