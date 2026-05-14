import SystemMetricsChart from "../components/analytics/SystemMetricsChart";

import SystemMetricRing from "../components/common/SystemMetricRing";

import MetricMiniCard from "../components/common/MetricMiniCard";


function AnalyticsPage() {

  return (

    <div
      className="
        flex
        flex-col
        gap-8
      "
    >
    {/* Top Metrics */}

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      "
    >

      <MetricMiniCard
        label="Inference Speed"
        value="58 FPS"
        subtext="
          Realtime GPU inference
        "
      />

      <MetricMiniCard
        label="Queue Throughput"
        value="412 Jobs"
        subtext="
          Processed in last hour
        "
      />

      <MetricMiniCard
        label="Worker Availability"
        value="99.2%"
        subtext="
          Celery orchestration uptime
        "
      />

      <MetricMiniCard
        label="Average Latency"
        value="182ms"
        subtext="
          Pipeline execution delay
        "
      />

    </div>

      {/* Chart */}

      <SystemMetricsChart />

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >

          <div
            className="
              rounded-2xl
              border
              border-[#1F2937]
              bg-[#111827]
              p-8
            "
          >

            <SystemMetricRing
              label="GPU Utilization"
              value={87}
              color="#3B82F6"
            />

          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#1F2937]
              bg-[#111827]
              p-8
            "
          >

            <SystemMetricRing
              label="Queue Efficiency"
              value={92}
              color="#10B981"
            />

          </div>


          <div
            className="
              rounded-2xl
              border
              border-[#1F2937]
              bg-[#111827]
              p-8
            "
          >

            <SystemMetricRing
              label="AI Accuracy"
              value={96}
              color="#A855F7"
            />

          </div>

        </div>

      {/* Lower Panels */}

      <div
        className="
          grid
          grid-cols-1 xl:grid-cols-2
          gap-6
        "
      >

        {[1, 2].map(
          (
            item
          ) => (

            <div
              key={item}
              className="
                rounded-2xl
                border
                border-[#1F2937]
                bg-[#111827]
                p-6
              "
            >

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                Operational Insights
              </h2>

              <div
                className="
                  mt-6
                  h-[240px]
                  rounded-xl
                  bg-[#0F172A]
                "
              />

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default AnalyticsPage;