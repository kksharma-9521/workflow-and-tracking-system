import {
  Search,
} from "lucide-react";


function TopSearchBar() {

  return (

    <div
      className="
        flex
        items-center
        gap-4
      "
    >

      {/* Search */}

      <div
        className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-[#1F2937]
          bg-[#0F172A]
          px-4
          py-3
        "
      >

        <Search
          size={18}
          className="
            text-gray-400
          "
        />

        <input
          type="text"
          placeholder="Search jobs..."
          className="
            bg-transparent
            text-sm
            text-white
            outline-none
            placeholder:text-gray-500
          "
        />

      </div>

    </div>
  );
}

export default TopSearchBar;