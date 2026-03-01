export function SearchBar(props: any) {
  return (
    <div className="flex items-center border border-gray-100 rounded-3xl px-6 w-full gap-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 transition-all duration-300 bg-white shadow-sm hover:shadow-md h-14">
      
      {/* 🔍 Search Icon */}
      <div className="text-blue-500 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* ✍️ Input Field */}
      <input
        type="text"
        placeholder="Search your courses"
        className="outline-none py-2 w-full text-sm md:text-base text-gray-700 font-medium bg-transparent placeholder:text-gray-400 placeholder:font-normal"
        value={props.search}
        onChange={props.handleSearch}
      />

      {/* ❌ Clear Button */}
      {props.search ? (
        <button
          type="button"
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 cursor-pointer"
          onClick={() => props.setSearch("")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : (<></>
      )}
    </div>
  );
}