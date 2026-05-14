import {
  Activity,
  CheckCircle2,
  Clock3,
  Video,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import PageHeader from "../components/common/PageHeader";

import GradientMetricCard from "../components/cards/GradientMetricCard";

import useDashboardMetrics from "../hooks/useDashboardMetrics";

import SkeletonCard from "../components/common/SkeletonCard";

import ServerStatusBanner from "../components/common/ServerStatusBanner";

import RealtimeActivityFeed from "../components/tracking/RealtimeActivityFeed";

import {
  connectProgressStream,
} from "../services/progressService";

import StatsCard from "../components/cards/StatsCard";

import RealtimeProgressCard from "../components/progress/RealtimeProgressCard";


function DashboardPage() {

  const {
    metrics,
    loading,
  } = useDashboardMetrics();

  const [
    liveProgress,
    setLiveProgress,
  ] = useState<any>(
    null
  );


  useEffect(() => {

    const eventSource =
      connectProgressStream(
        (data) => {

          setLiveProgress(
            data
          );
        }
      );

    return () => {

      eventSource.close();
    };

  }, []);


  return (

    <div
      className="
        flex
        flex-col
        gap-8
      "
    >

      <PageHeader
        title="Operations Dashboard"
        subtitle="
          Realtime monitoring
          of AI processing
          workflows
        "
      />

      <ServerStatusBanner
        online={true}
      />


      {/* Operational Metrics */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
        "
      >

        <GradientMetricCard
          title="Total Jobs"
          value={
            metrics?.totalJobs ?? 0
          }
          gradient="
            bg-gradient-to-r
            from-blue-500
            to-cyan-500
          "
        />

        <GradientMetricCard
          title="Processing Jobs"
          value={
            metrics?.processingJobs ?? 0
          }
          gradient="
            bg-gradient-to-r
            from-green-500
            to-emerald-500
          "
        />

        <GradientMetricCard
          title="Completed Jobs"
          value={
            metrics?.completedJobs ?? 0
          }
          gradient="
            bg-gradient-to-r
            from-purple-500
            to-pink-500
          "
        />

      </div>


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

        {loading ? (

          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>

        ) : (

          <>

            <StatsCard
              title="Total Video Jobs"
              value={
                metrics?.totalJobs ?? 0
              }
              icon={Video}
              change="+12%"
            />

            <StatsCard
              title="Processing Jobs"
              value={
                metrics?.processingJobs ?? 0
              }
              icon={Clock3}
              color="text-yellow-400"
            />

            <StatsCard
              title="Completed Jobs"
              value={
                metrics?.completedJobs ?? 0
              }
              icon={CheckCircle2}
              color="text-green-400"
            />

            <StatsCard
              title="Failed Jobs"
              value={
                metrics?.failedJobs ?? 0
              }
              icon={Activity}
              color="text-red-400"
            />

          </>

        )}

      </div>


      {/* Live Progress */}

      {liveProgress && (

        <RealtimeProgressCard
          title="Current Processing Job"
          progress={
            liveProgress.progress
          }
          status={
            liveProgress.status
          }
          stage={
            liveProgress.current_stage
          }
        />

      )}


      {/* Activity Feed */}

      <div className="mt-2">

        <RealtimeActivityFeed />

      </div>

    </div>
  );
}

export default DashboardPage;