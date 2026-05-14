type Props = {

  label: string;

  value: number;

  color: string;
};


function SystemMetricRing({
  label,
  value,
  color,
}: Props) {

  const radius = 52;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (value / 100) *
      circumference;


  return (

    <div
      className="
        flex
        flex-col
        items-center
        justify-center
      "
    >

      <div className="relative">

        <svg
          width="140"
          height="140"
          className="
            -rotate-90
          "
        >

          {/* Background */}

          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#1F2937"
            strokeWidth="10"
            fill="transparent"
          />

          {/* Progress */}

          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={
              circumference
            }
            strokeDashoffset={
              offset
            }
          />

        </svg>


        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
          "
        >

          <span
            className="
              text-2xl
              font-bold
            "
          >
            {value}%
          </span>

        </div>

      </div>


      <p
        className="
          mt-4
          text-sm
          text-gray-400
        "
      >
        {label}
      </p>

    </div>
  );
}

export default SystemMetricRing;