import {
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  Upload,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import StatusBadge from "../components/common/StatusBadge";


type DocumentResult = {

  category?: string;

  summary?: string;

  keywords?: string[];

  word_count?: number;

  character_count?: number;

  preview_text?: string;
};


type DocumentJob = {

  id: number;

  original_filename?: string;

  status: string;

  progress: number;

  current_stage?: string;

  result?: DocumentResult;

  finalized?: boolean;
};


function DocumentWorkflowPage() {

  const fileInputRef =
    useRef<HTMLInputElement>(
      null
    );

  const [
    jobs,
    setJobs,
  ] = useState<
    DocumentJob[]
  >([]);

  const [
    uploading,
    setUploading,
  ] = useState(false);


  async function fetchJobs() {

    try {

      const response =
        await fetch(
          "http://127.0.0.1:8000/api/documents"
        );

      if (!response.ok) {

        setJobs([]);

        return;
      }

      const data =
        await response.json();

      if (
        Array.isArray(
          data.items
        )
      ) {

        setJobs(
          data.items
        );

      } else {

        setJobs([]);
      }

    } catch (
      error
    ) {

      console.error(
        error
      );

      setJobs([]);
    }
  }


  useEffect(() => {

    fetchJobs();

    const interval =
      setInterval(
        fetchJobs,
        2000
      );

    return () => {

      clearInterval(
        interval
      );
    };

  }, []);


  async function handleUpload(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target
        .files?.[0];

    if (!file) {

      return;
    }

    try {

      setUploading(
        true
      );

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "http://127.0.0.1:8000/api/documents/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      if (
        !response.ok
      ) {

        throw new Error(
          "Upload failed"
        );
      }

      await fetchJobs();

    } catch (
      error
    ) {

      console.error(
        error
      );

      alert(
        "Failed to upload document"
      );

    } finally {

      setUploading(
        false
      );
    }
  }


  const totalDocuments =
    jobs.length;

  const queuedJobs =
    jobs.filter(
      (
        job
      ) =>
        job.status ===
        "queued"
    ).length;

  const completedJobs =
    jobs.filter(
      (
        job
      ) =>
        job.status ===
        "completed"
    ).length;

  const processedResults =
    jobs.filter(
      (
        job
      ) =>
        !!job.result
    ).length;


  return (

    <div
      className="
        flex
        flex-col
        gap-8
      "
    >

      {/* Upload */}

      <div
        className="
          rounded-2xl
          border
          border-[#1F2937]
          bg-[#111827]
          p-8
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
                text-2xl
                font-bold
              "
            >
              Document Workflow
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-400
              "
            >
              Async AI document
              processing pipeline
            </p>

          </div>


          <div>

            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="
                .pdf,
                .doc,
                .docx
              "
              className="
                hidden
              "
              onChange={
                handleUpload
              }
            />

            <button

              onClick={() => {

                fileInputRef
                  .current
                  ?.click();
              }}

              disabled={
                uploading
              }

              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                py-3
                font-semibold
                hover:bg-blue-500
                disabled:opacity-50
              "
            >

              <Upload
                size={18}
              />

              {
                uploading
                  ? "Uploading..."
                  : "Upload Document"
              }

            </button>

          </div>

        </div>

      </div>


      {/* Metrics */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

        {[
          {
            label:
              "Total Documents",

            value:
              totalDocuments,

            icon: FileText,
          },

          {
            label:
              "Queued Jobs",

            value:
              queuedJobs,

            icon: Clock3,
          },

          {
            label:
              "Completed",

            value:
              completedJobs,

            icon:
              CheckCircle2,
          },

          {
            label:
              "Processed Results",

            value:
              processedResults,

            icon: Download,
          },
        ].map(
          (
            item
          ) => {

            const Icon =
              item.icon;

            return (

              <div
                key={
                  item.label
                }
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

                    <p
                      className="
                        text-sm
                        text-gray-400
                      "
                    >
                      {
                        item.label
                      }
                    </p>

                    <h2
                      className="
                        mt-4
                        text-3xl
                        font-bold
                      "
                    >
                      {
                        item.value
                      }
                    </h2>

                  </div>

                  <div
                    className="
                      rounded-xl
                      bg-[#0F172A]
                      p-4
                    "
                  >

                    <Icon
                      size={24}
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


      {/* Queue */}

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
            Processing Queue
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-400
            "
          >
            Live async document workflow
          </p>

        </div>


        <div className="mt-8 overflow-x-auto">

          <table
            className="
              w-full
              border-collapse
            "
          >

            <thead>

              <tr
                className="
                  border-b
                  border-[#1F2937]
                  text-left
                  text-sm
                  text-gray-400
                "
              >

                <th className="pb-4">
                  Document
                </th>

                <th className="pb-4">
                  Status
                </th>

                <th className="pb-4">
                  Progress
                </th>

                <th className="pb-4">
                  Stage
                </th>

                <th className="pb-4">
                  Parsed Output
                </th>

              </tr>

            </thead>

            <tbody>

              {jobs.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="
                      py-10
                      text-center
                      text-sm
                      text-gray-500
                    "
                  >
                    No documents found
                  </td>

                </tr>

              ) : (

                jobs.map(
                  (
                    row
                  ) => (

                    <tr
                      key={
                        row.id
                      }
                      className="
                        border-b
                        border-[#1F2937]
                        align-top
                      "
                    >

                      <td
                        className="
                          py-5
                          text-sm
                          min-w-[220px]
                        "
                      >
                        {
                          row.original_filename
                        }
                      </td>

                      <td
                        className="
                          py-5
                        "
                      >

                        <StatusBadge
                          status={
                            row.status
                          }
                        />

                      </td>

                      <td
                        className="
                          py-5
                          text-sm
                        "
                      >
                        {
                          row.progress
                        }
                        %
                      </td>

                      <td
                        className="
                          py-5
                          text-sm
                          text-gray-400
                          min-w-[180px]
                        "
                      >
                        {
                          row.current_stage
                        }
                      </td>

                      <td
                        className="
                          py-5
                          text-sm
                        "
                      >

                        {row.result ? (

                          <div
                            className="
                              rounded-xl
                              bg-[#0F172A]
                              p-4
                              text-xs
                              text-gray-300
                              space-y-3
                              min-w-[350px]
                            "
                          >

                            <div>

                              <span
                                className="
                                  text-gray-500
                                "
                              >
                                Category:
                              </span>

                              {" "}

                              <span
                                className="
                                  text-blue-400
                                  font-semibold
                                "
                              >
                                {
                                  row.result
                                    .category
                                }
                              </span>

                            </div>


                            <div>

                              <span
                                className="
                                  text-gray-500
                                "
                              >
                                Summary:
                              </span>

                              <p
                                className="
                                  mt-1
                                  leading-6
                                "
                              >
                                {
                                  row.result
                                    .summary
                                }
                              </p>

                            </div>


                            <div>

                              <span
                                className="
                                  text-gray-500
                                "
                              >
                                Keywords:
                              </span>

                              <div
                                className="
                                  mt-2
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                              >

                                {Array.isArray(
                                  row.result
                                    .keywords
                                ) &&

                                  row.result
                                    .keywords
                                    .map(
                                      (
                                        keyword,
                                        index
                                      ) => (

                                        <span
                                          key={
                                            index
                                          }
                                          className="
                                            rounded-full
                                            bg-blue-500/10
                                            px-3
                                            py-1
                                            text-blue-300
                                          "
                                        >
                                          {
                                            keyword
                                          }
                                        </span>
                                      )
                                    )}

                              </div>

                            </div>


                            <div>

                              <span
                                className="
                                  text-gray-500
                                "
                              >
                                Word Count:
                              </span>

                              {" "}

                              {
                                row.result
                                  .word_count
                              }

                            </div>


                            <details>

                              <summary
                                className="
                                  cursor-pointer
                                  text-green-400
                                "
                              >
                                View Extracted Text
                              </summary>

                              <div
                                className="
                                  mt-3
                                  max-h-[220px]
                                  overflow-y-auto
                                  rounded-lg
                                  bg-black/20
                                  p-3
                                  whitespace-pre-wrap
                                  text-gray-400
                                "
                              >

                                {
                                  row.result
                                    .preview_text
                                }

                              </div>

                            </details>

                          </div>

                        ) : (

                          <span
                            className="
                              text-yellow-400
                            "
                          >
                            Processing
                          </span>

                        )}

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default DocumentWorkflowPage;