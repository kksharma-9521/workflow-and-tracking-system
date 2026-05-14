import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


type Props = {

  processedFrames?: number;

  detectedObjects?: number;

  skippedFrames?: number;
};


function SystemMetricsChart({
  processedFrames = 0,
  detectedObjects = 0,
  skippedFrames = 0,
}: Props) {

  const data = [

    {
      name: "Processed",
      value: processedFrames,
    },

    {
      name: "Detected",
      value: detectedObjects,
    },

    {
      name: "Skipped",
      value: skippedFrames,
    },
  ];


  return (

    <div
      className="
        rounded-2xl
        border
        border-[#1F2937]
        bg-[#111827]
        p-6
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-xl
              font-bold
            "
          >
            Processing Overview
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-400
            "
          >
            Realtime tracking
            analytics from
            video processing
          </p>

        </div>


        {/* Summary */}

        <div
          className="
            rounded-xl
            border
            border-blue-500/20
            bg-blue-500/10
            px-4
            py-2
          "
        >

          <p
            className="
              text-xs
              text-blue-300
            "
          >
            Total Activity
          </p>

          <h3
            className="
              mt-1
              text-lg
              font-bold
              text-blue-400
            "
          >
            {
              processedFrames +
              detectedObjects
            }
          </h3>

        </div>

      </div>


      {/* Chart */}

      <div className="mt-8 h-[320px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart
            data={data}
          >

            <defs>

              <linearGradient
                id="colorMetric"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="5%"
                  stopColor="#3B82F6"
                  stopOpacity={0.7}
                />

                <stop
                  offset="95%"
                  stopColor="#3B82F6"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1F2937"
            />

            <XAxis
              dataKey="name"
              stroke="#9CA3AF"
            />

            <YAxis
              stroke="#9CA3AF"
            />

            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#111827",

                border:
                  "1px solid #1F2937",

                borderRadius:
                  "12px",

                color:
                  "#FFFFFF",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorMetric)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>


      {/* Footer Stats */}

      <div
        className="
          mt-6
          grid
          grid-cols-3
          gap-4
        "
      >

        <div
          className="
            rounded-xl
            bg-[#0F172A]
            p-4
          "
        >

          <p
            className="
              text-xs
              text-gray-400
            "
          >
            Processed
          </p>

          <h3
            className="
              mt-2
              text-xl
              font-bold
            "
          >
            {processedFrames}
          </h3>

        </div>


        <div
          className="
            rounded-xl
            bg-[#0F172A]
            p-4
          "
        >

          <p
            className="
              text-xs
              text-gray-400
            "
          >
            Objects
          </p>

          <h3
            className="
              mt-2
              text-xl
              font-bold
            "
          >
            {detectedObjects}
          </h3>

        </div>


        <div
          className="
            rounded-xl
            bg-[#0F172A]
            p-4
          "
        >

          <p
            className="
              text-xs
              text-gray-400
            "
          >
            Skipped
          </p>

          <h3
            className="
              mt-2
              text-xl
              font-bold
            "
          >
            {skippedFrames}
          </h3>

        </div>

      </div>

    </div>
  );
}

export default SystemMetricsChart;