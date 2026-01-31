export function SearchBar(props: any) {
  return (
    <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 w-full gap-3 focus-within:border-blue-500 transition-colors bg-white">
      {/* Search Icon (Magnifying Glass) */}
      <div className="text-gray-400 shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="outline-none py-2 w-full text-sm md:text-base text-gray-700 bg-transparent"
        value={props.search}
        onChange={props.handleSearch}
      />

      {/* Clear Button (X Icon) */}
      {props.search ? (
        <button
          type="button"
          className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
          onClick={() => props.setSearch("")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}