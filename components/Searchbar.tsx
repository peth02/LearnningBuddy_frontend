export function SearchBar(props:any) {
    return(
    <div className="flex border border-gray-300 rounded-lg px-5 w-full gap-5">
        <div className="py-2">icon</div>
        <input
          type="text"
          placeholder="Search..."
          className="outline-none py-2 w-full"
          value={props.search}
          onChange={props.handleSearch}
        />
        {
          props.search ? (
            <div className="py-2" onClick={()=>{props.setSearch("")}}>delete</div>
          ) : (
            <></>
          )
        }
    </div>
    );
}