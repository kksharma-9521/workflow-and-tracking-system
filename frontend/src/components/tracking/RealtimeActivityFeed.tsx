import {
  Activity,
  CheckCircle2,
  Clock3,
  FileVideo,
} from "lucide-react";


const activities = [

  {
    id: 1,
    type: "processing",
    text:
      "Inference engine processing camera_feed_01.mp4",
    time: "2 sec ago",
  },

  {
    id: 2,
    type: "completed",
    text:
      "Tracking completed for retail_store.mp4",
    time: "18 sec ago",
  },

  {
    id: 3,
    type: "queued",
    text:
      "New video uploaded to AI queue",
    time: "42 sec ago",
  },

  {
    id: 4,
    type: "processing",
    text:
      "Identity synchronization running",
    time: "1 min ago",
  },
];


function RealtimeActivityFeed() {

  function renderIcon(
    type: string
  ) {

    switch (type) {

      case "completed":

        return (

          <CheckCircle2
            size={18}
            className="
              text-emerald-400
            "
          />
        );

      case "processing":

        return (

          <Activity
            size={18}
            className="
              animate-pulse
              text-blue-400
            "
          />
        );

      default:

        return (

          <Clock3
            size={18}
            className="
              text-yellow-400
            "
          />
        );
    }
  }


  return (

    <div
      className="
        rounded-2xl
        border
        border-white/5
        bg-[#111827]
        p-6
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
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
            Realtime Activity
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-400
            "
          >
            Live orchestration events
          </p>

        </div>


        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-emerald-500/20
            bg-emerald-500/10
            px-3
            py-2
          "
        >

          <div
            className="
              h-2
              w-2
              animate-pulse
              rounded-full
              bg-emerald-400
            "
          />

          <span
            className="
              text-xs
              font-semibold
              text-emerald-400
            "
          >
            LIVE
          </span>

        </div>

      </div>


      {/* Feed */}

      <div
        className="
          mt-8
          flex
          flex-col
          gap-5
        "
      >

        {activities.map(
          (
            activity
          ) => (

            <div
              key={activity.id}
              className="
                flex
                items-start
                gap-4
                rounded-xl
                border
                border-white/5
                bg-[#0F172A]
                p-4
                transition-all
                hover:border-blue-500/20
              "
            >

              <div
                className="
                  mt-1
                "
              >

                {renderIcon(
                  activity.type
                )}

              </div>


              <div className="flex-1">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <FileVideo
                    size={14}
                    className="
                      text-gray-500
                    "
                  />

                  <span
                    className="
                      text-xs
                      uppercase
                      tracking-wide
                      text-gray-500
                    "
                  >
                    AI EVENT
                  </span>

                </div>


                <p
                  className="
                    mt-2
                    text-sm
                    text-white
                  "
                >
                  {activity.text}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    text-gray-500
                  "
                >
                  {activity.time}
                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default RealtimeActivityFeed;