type Props = {

  label: string;

  value: string | number;

  color?: string;
};


function DataPill({
  label,
  value,
  color,
}: Props) {

  return (

    <div
      className="
        flex
        items-center
        gap-2
        rounded-xl
        border
        border-[#1F2937]
        bg-[#0F172A]
        px-4
        py-2
      "
    >

      <span
        className="
          text-xs
          text-gray-400
        "
      >
        {label}
      </span>

      <span
        className={`
          text-sm
          font-semibold
          ${
            color ??
            "text-white"
          }
        `}
      >
        {value}
      </span>

    </div>
  );
}

export default DataPill;