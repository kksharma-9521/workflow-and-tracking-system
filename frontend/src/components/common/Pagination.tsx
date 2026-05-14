type Props = {

  currentPage: number;

  totalPages: number;

  onPageChange: (
    page: number
  ) => void;
};


function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {

  if (totalPages <= 1)
    return null;


  return (

    <div
      className="
        mt-8
        flex
        items-center
        justify-between
      "
    >

      <p
        className="
          text-sm
          text-gray-400
        "
      >
        Page {currentPage}
        {" "}
        of {totalPages}
      </p>


      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <button
          disabled={
            currentPage === 1
          }
          onClick={() =>
            onPageChange(
              currentPage - 1
            )
          }
          className="
            rounded-xl
            border
            border-[#1F2937]
            bg-[#0F172A]
            px-4
            py-2
            text-sm
            transition-all
            hover:bg-[#1E293B]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Previous
        </button>


        <button
          disabled={
            currentPage ===
            totalPages
          }
          onClick={() =>
            onPageChange(
              currentPage + 1
            )
          }
          className="
            rounded-xl
            border
            border-[#1F2937]
            bg-[#0F172A]
            px-4
            py-2
            text-sm
            transition-all
            hover:bg-[#1E293B]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Pagination;