import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";


import type {
  WorkflowStage,
  WorkflowStageStatus,
} from "../../types/workflow";


type Props = {

  stages: WorkflowStage[];
};


function SubTaskTrace({
  stages,
}: Props) {

  function renderIcon(
    status: WorkflowStageStatus
  ) {

    switch (status) {

      case "completed":

        return (

          <CheckCircle2
            size={18}
            className="
              text-emerald-400
            "
          />
        );

      case "active":

        return (

          <LoaderCircle
            size={18}
            className="
              animate-spin
              text-emerald-400
            "
          />
        );

      case "failed":

        return (

          <AlertTriangle
            size={18}
            className="
              text-red-400
            "
          />
        );

      default:

        return (

          <div
            className="
              h-3
              w-3
              rounded-full
              bg-white/20
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

      <div>

        <h2
          className="
            text-lg
            font-bold
          "
        >
          Workflow Trace
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-gray-400
          "
        >
          Realtime asynchronous execution stages
        </p>

      </div>


      {/* Timeline */}

      <div
        className="
          mt-8
          flex
          flex-col
          gap-6
        "
      >

        {stages.map(
          (
            stage,
            index
          ) => (

            <div
              key={stage.id}
              className="
                flex
                gap-4
              "
            >

              {/* Left Timeline */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-[#0F172A]
                  "
                >

                  {renderIcon(
                    stage.stage_status
                  )}

                </div>


                {index !==
                  stages.length - 1 && (

                  <div
                    className="
                      mt-2
                      h-full
                      w-[1px]
                      bg-white/10
                    "
                  />

                )}

              </div>


              {/* Content */}

              <div className="pb-6">

                <h3
                  className={`
                    text-sm
                    font-semibold

                    ${
                      stage.stage_status ===
                      "active"

                        ? "text-emerald-400"

                        : stage.stage_status ===
                          "failed"

                        ? "text-red-400"

                        : stage.stage_status ===
                          "completed"

                        ? "text-white"

                        : "text-gray-500"
                    }
                  `}
                >
                  {stage.stage_name}
                </h3>

                <p
                  className="
                    mt-1
                    text-xs
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  {stage.stage_status}
                </p>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default SubTaskTrace;