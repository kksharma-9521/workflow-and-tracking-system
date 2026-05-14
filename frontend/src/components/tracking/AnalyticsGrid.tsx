import {
  Activity,
  Clock3,
  Cpu,
  Database,
  Layers3,
  TimerReset,
} from "lucide-react";


type Props = {

  analytics: {

    fps?: number;

    frame_count?: number;

    processed_frames?: number;

    skipped_frames?: number;

    detected_object_count?: number;

    processing_duration_seconds?: number;

    average_inference_time?: number;

    effective_processing_fps?: number;

    device?: string;
  };
};


function AnalyticsGrid({
  analytics,
}: Props) {

  const cards = [

    {
      title:
        "Video FPS",

      value:
        analytics.fps ?? 0,

      icon:
        Activity,
    },

    {
      title:
        "Processed Frames",

      value:
        analytics.processed_frames
        ?? 0,

      icon:
        Layers3,
    },

    {
      title:
        "Skipped Frames",

      value:
        analytics.skipped_frames
        ?? 0,

      icon:
        TimerReset,
    },

    {
      title:
        "Detected Objects",

      value:
        analytics.detected_object_count
        ?? 0,

      icon:
        Database,
    },

    {
      title:
        "Processing Time",

      value:
        `${
          analytics.processing_duration_seconds
          ?? 0
        }s`,

      icon:
        Clock3,
    },

    {
      title:
        "Effective FPS",

      value:
        analytics
          .effective_processing_fps
        ?? 0,

      icon:
        Cpu,
    },
  ];


  return (

    <div
      className="
        rounded-2xl
        border
        border-white/5
        bg-[#111827]
        p-8
      "
    >

      {/* Header */}

      <div
        className="
          mb-8
        "
      >

        <h2
          className="
            text-2xl
            font-bold
          "
        >
          Tracking Intelligence
        </h2>

        <p
          className="
            mt-2
            text-gray-400
          "
        >
          Operational analytics
          from AI video
          tracking pipeline
        </p>

      </div>


      {/* Grid */}

      <div
        className="
          grid
          gap-5
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        {cards.map(
          (
            card
          ) => {

            const Icon =
              card.icon;

            return (

              <div
                key={
                  card.title
                }
                className="
                  rounded-2xl
                  border
                  border-white/5
                  bg-[#0F172A]
                  p-5
                  transition-all
                  duration-300
                  hover:border-blue-500/20
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
                      {
                        card.title
                      }
                    </p>

                    <h3
                      className="
                        mt-3
                        text-3xl
                        font-bold
                      "
                    >
                      {
                        card.value
                      }
                    </h3>

                  </div>

                  <div
                    className="
                      rounded-xl
                      bg-blue-500/10
                      p-3
                    "
                  >

                    <Icon
                      size={22}
                      className="
                        text-blue-400
                      "
                    />

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

export default AnalyticsGrid;