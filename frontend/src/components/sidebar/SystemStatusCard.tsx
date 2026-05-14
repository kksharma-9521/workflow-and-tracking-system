import useSystemHealth from "../../hooks/useSystemHealth";


function SystemStatusCard() {

  const {
    health,
    loading,
  } = useSystemHealth();


  const services = [

    {
      name: "API Service",

      status:
        health?.status ??
        "offline",
    },

    {
      name: "Queue Engine",

      status:
        health?.redis ??
        "healthy",
    },

    {
      name: "Task Workers",

      status:
        health?.celery ??
        "healthy",
    },

    {
      name: "Data Storage",

      status:
        health?.database ??
        "healthy",
    },
  ];


  function getStatusColor(
    status: string
  ) {

    return status ===
      "healthy"

      ? "bg-green-500"

      : "bg-red-500";
  }


  return (

    <div
      className="
        rounded-2xl
        border
        border-[#1F2937]
        bg-[#0F172A]
        p-4
      "
    >

      <h3
        className="
          text-sm
          font-semibold
        "
      >
        Infrastructure Health
      </h3>

      <div
        className="
          mt-5
          flex
          flex-col
          gap-4
        "
      >

        {services.map(
          (service) => (

            <div
              key={service.name}
              className="
                flex
                items-center
                justify-between
              "
            >

              <span
                className="
                  text-sm
                  text-gray-300
                "
              >
                {service.name}
              </span>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <div
                  className={`
                    h-2.5
                    w-2.5
                    rounded-full
                    ${getStatusColor(
                      service.status
                    )}
                  `}
                />

                <span
                  className="
                    text-xs
                    text-gray-300
                  "
                >
                  {
                    loading
                      ? "checking..."
                      : service.status
                  }
                </span>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default SystemStatusCard;