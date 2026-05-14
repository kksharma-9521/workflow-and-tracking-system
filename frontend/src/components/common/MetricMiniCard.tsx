type Props = {

  label: string;

  value: string;

  subtext?: string;
};


function MetricMiniCard({
  label,
  value,
  subtext,
}: Props) {

  return (

    <div
      className="
        rounded-xl
        border
        border-[#1F2937]
        bg-[#0F172A]
        p-4
      "
    >

      <p
        className="
          text-xs
          uppercase
          tracking-wide
          text-gray-400
        "
      >
        {label}
      </p>

      <h3
        className="
          mt-3
          text-2xl
          font-bold
        "
      >
        {value}
      </h3>

      {subtext && (

        <p
          className="
            mt-2
            text-xs
            text-gray-500
          "
        >
          {subtext}
        </p>

      )}

    </div>
  );
}

export default MetricMiniCard;