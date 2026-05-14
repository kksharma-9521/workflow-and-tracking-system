type Props = {

  value: string;

  onChange: (
    value: string
  ) => void;

  placeholder?: string;
};


function TableSearch({
  value,
  onChange,
  placeholder,
}: Props) {

  return (

    <input
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      placeholder={
        placeholder ??
        "Search..."
      }
      className="
        w-full
        rounded-xl
        border
        border-[#1F2937]
        bg-[#0F172A]
        px-4
        py-3
        text-sm
        outline-none
        transition-all
        focus:border-blue-500
      "
    />
  );
}

export default TableSearch;