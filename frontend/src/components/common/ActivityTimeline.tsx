type Activity = {

  id: number;

  title: string;

  time: string;

  status: string;
};


type Props = {

  items: Activity[];
};


function ActivityTimeline({
  items,
}: Props) {

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
          Recent orchestration events
        </p>

      </div>


      <div
        className="
          mt-8
          flex
          flex-col
          gap-6
        "
      >

        {items.map(
          (item, index) => (

            <div
              key={item.id}
              className="
                flex
                gap-4
              "
            >

              {/* Timeline */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <div
                  className={`
                    h-3
                    w-3
                    rounded-full

                    ${
                      item.status ===
                      "completed"

                        ? "bg-green-500"

                        : item.status ===
                          "failed"

                        ? "bg-red-500"

                        : "bg-blue-500"
                    }
                  `}
                />

                {index !==
                  items.length - 1 && (

                  <div
                    className="
                      mt-2
                      h-full
                      w-[1px]
                      bg-[#1F2937]
                    "
                  />

                )}

              </div>


              {/* Content */}

              <div className="pb-6">

                <h3
                  className="
                    text-sm
                    font-semibold
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-400
                  "
                >
                  {item.time}
                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default ActivityTimeline;