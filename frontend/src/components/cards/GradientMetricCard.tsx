type Props = {

  title: string;

  value: string;

  gradient: string;
};


function GradientMetricCard({
  title,
  value,
  gradient,
}: Props) {

  return (

    <div
      className={`
        rounded-2xl
        p-[1px]
        ${gradient}
      `}
    >

      <div
        className="
          rounded-2xl
          bg-[#111827]
          p-6
        "
      >

        <p
          className="
            text-sm
            text-gray-400
          "
        >
          {title}
        </p>

        <h2
          className="
            mt-4
            text-4xl
            font-bold
          "
        >
          {value}
        </h2>

      </div>

    </div>
  );
}

export default GradientMetricCard;