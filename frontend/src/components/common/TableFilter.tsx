type Props = {

  value: string;

  onChange: (
    value: string
  ) => void;

  options: string[];
};


function TableFilter({
  value,
  onChange,
  options,
}: Props) {

  return (

    <select
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value
        )
      }
      className="
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
    >

      <option value="">
        All Statuses
      </option>

      {options.map(
        (option) => (

          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        )
      )}

    </select>
  );
}

export default TableFilter;