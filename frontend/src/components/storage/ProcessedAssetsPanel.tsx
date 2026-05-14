import {
  Download,
  FileText,
  PlayCircle,
  Video,
} from "lucide-react";

import type {
  VideoJob,
} from "../../types/video";


type Props = {

  jobs: VideoJob[];
};


function ProcessedAssetsPanel({
  jobs,
}: Props) {

  const completedJobs =
    jobs.filter(
      (
        job
      ) =>

        job.status ===
        "completed"
    );


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
          flex
          items-center
          justify-between
        "
      >

        <div>

          <h2
            className="
              text-2xl
              font-bold
            "
          >
            Processed Assets
          </h2>

          <p
            className="
              mt-2
              text-gray-400
            "
          >
            Historical AI-generated
            outputs and exports
          </p>

        </div>

      </div>


      {/* Empty State */}

      {completedJobs.length === 0 && (

        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-white/10
            p-10
            text-center
          "
        >

          <p
            className="
              text-gray-400
            "
          >
            No processed assets available
          </p>

        </div>

      )}


      {/* Asset List */}

      <div
        className="
          flex
          flex-col
          gap-4
        "
      >

        {completedJobs.map(
          (
            job
          ) => (

            <div
              key={job.id}
              className="
                flex
                items-center
                justify-between
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

              {/* Left */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    rounded-xl
                    bg-blue-500/10
                    p-3
                  "
                >

                  <Video
                    className="
                      text-blue-400
                    "
                    size={22}
                  />

                </div>

                <div>

                  <h3
                    className="
                      max-w-[280px]
                      truncate
                      text-sm
                      font-semibold
                    "
                  >
                    {
                      job.original_filename
                    }
                  </h3>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <span
                      className="
                        rounded-full
                        bg-emerald-500/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-emerald-400
                      "
                    >
                      Completed
                    </span>

                    <span
                      className="
                        text-xs
                        text-gray-500
                      "
                    >
                      ID #{job.id}
                    </span>

                  </div>

                </div>

              </div>


              {/* Right */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                {/* Open */}

                <a
                  href={`http://localhost:8000/${job.output_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-2
                    text-sm
                    transition-all
                    hover:border-blue-500/30
                    hover:bg-blue-500/10
                  "
                >

                  <PlayCircle
                    size={16}
                  />

                  Open

                </a>


                {/* Download */}

                <a
                  href={`http://127.0.0.1:8000/api/videos/${job.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    transition-all
                    hover:bg-blue-500
                  "
                >

                  <Download
                    size={16}
                  />

                  Download

                </a>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}

export default ProcessedAssetsPanel;