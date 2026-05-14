type Props = {

  title: string;

  progress: number;

  status: string;

  stage?: string;
};


function RealtimeProgressCard({
  title,
  progress,
  status,
  stage,
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
              text-lg
              font-bold
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-400
            "
          >
            {stage}
          </p>

        </div>

        <div
          className="
            rounded-lg
            bg-[#0F172A]
            px-4
            py-2
            text-sm
            text-blue-400
          "
        >
          {status}
        </div>

      </div>


      {/* Progress Bar */}

      <div className="mt-6">

        <div
          className="
            flex
            items-center
            justify-between
            text-sm
          "
        >

          <span>
            Processing
          </span>

          <span
            className="
              text-blue-400
            "
          >
            {progress}%
          </span>

        </div>

        <div
          className="
            mt-3
            h-3
            overflow-hidden
            rounded-full
            bg-[#1F2937]
          "
        >

          <div
            className="
              h-full
              rounded-full
              bg-blue-500
              transition-all
              duration-700
            "
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>

      </div>

    </div>
  );
}

export default RealtimeProgressCard;