import StatTrend from "../common/StatTrend";

import AnimatedCounter from "../common/AnimatedCounter";

type Props = {

  title: string;

  value: string | number;

  icon: React.ElementType;

  change?: string;

  color?: string;
};


function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  color = "text-blue-400",
}: Props) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-[#1F2937]
        bg-[#111827]
        p-6
        transition-all
        duration-300
        hover:border-blue-500/40
        hover:shadow-[0_0_30px_rgba(59,130,246,0.08)]
      "
    >

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

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

            {typeof value ===
            "number" ? (

              <AnimatedCounter
                value={value}
              />

            ) : (

              value

            )}

          </h2>

          {change && (

            <div className="mt-5">

              <StatTrend
                value={change}
                positive={
                  !change.startsWith("-")
                }
              />

            </div>

          )}

        </div>

        <div
          className="
            rounded-xl
            bg-[#0F172A]
            p-4
          "
        >

          <Icon
            size={28}
            className={color}
          />

        </div>

      </div>

    </div>
  );
}

export default StatsCard;