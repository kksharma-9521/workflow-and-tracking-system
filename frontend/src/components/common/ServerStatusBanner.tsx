import {
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";


type Props = {

  online: boolean;
};


function ServerStatusBanner({
  online,
}: Props) {

  return (

    <div
      className={`
        flex
        items-center
        justify-between
        rounded-2xl
        border
        px-5
        py-4

        ${
          online

            ? `
              border-green-500/20
              bg-green-500/10
            `

            : `
              border-red-500/20
              bg-red-500/10
            `
        }
      `}
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        {online ? (

          <CheckCircle2
            size={20}
            className="
              text-green-400
            "
          />

        ) : (

          <AlertTriangle
            size={20}
            className="
              text-red-400
            "
          />

        )}

        <div>

          <h3
            className="
              text-sm
              font-semibold
            "
          >
            {online
              ? "Platform Operational"
              : "Platform Offline"}
          </h3>

          <p
            className="
              mt-1
              text-xs
              text-gray-400
            "
          >
            {online
              ? "Services are running normally"
              : "Some services are temporarily unreachable"}
          </p>

        </div>

      </div>


      <div
        className={`
          h-3
          w-3
          rounded-full

          ${
            online
              ? "bg-green-500"
              : "bg-red-500"
          }
        `}
      />

    </div>
  );
}

export default ServerStatusBanner;