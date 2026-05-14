import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Download,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import StatusBadge from "../common/StatusBadge";

import Modal from "../common/Modal";

import AsyncWrapper from "../common/AsyncWrapper";

import SectionCard from "../common/SectionCard";

import DataPill from "../common/DataPill";

import TableSearch from "../common/TableSearch";

import TableFilter from "../common/TableFilter";

import Pagination from "../common/Pagination";

import SubTaskTrace from "./SubTaskTrace";

import type {
  VideoJob,
} from "../../types/job";

import {
  getVideoJobs,
} from "../../api/dashboardApi";


function RecentJobsTable() {

  const [
    jobs,
    setJobs,
  ] = useState<VideoJob[]>(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(false);

  const [
    selectedJob,
    setSelectedJob,
  ] = useState<VideoJob | null>(
  null
  );

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const ITEMS_PER_PAGE = 5;


  function renderStatusIcon(
    status: string
  ) {

    switch (status) {

      case "completed":

        return (

          <CheckCircle2
            size={16}
            className="
              text-emerald-400
            "
          />
        );

      case "processing":

        return (

          <LoaderCircle
            size={16}
            className="
              animate-spin
              text-blue-400
            "
          />
        );

      case "failed":

        return (

          <AlertTriangle
            size={16}
            className="
              text-red-400
            "
          />
        );

      default:

        return (

          <Activity
            size={16}
            className="
              text-gray-400
            "
          />
        );
    }
  }


  useEffect(() => {

    async function fetchJobs() {

      try {

        const data =
          await getVideoJobs();

        setJobs(data);

      } catch (
        error
      ) {

        console.error(
          error
        );

        setError(true);

      } finally {

        setLoading(false);
      }
    }

    fetchJobs();

    const interval =
      setInterval(
        fetchJobs,
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, []);


  const filteredJobs =
    jobs.filter(
      (job) => {

        const matchesSearch =

          job.original_filename
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          String(job.id)
            .includes(search);


        const matchesStatus =

          statusFilter
            ? job.status ===
              statusFilter
            : true;


        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );


  const totalPages =
    Math.ceil(
      filteredJobs.length /
      ITEMS_PER_PAGE
    );


  const paginatedJobs =
    filteredJobs.slice(
      (
        currentPage - 1
      ) * ITEMS_PER_PAGE,

      currentPage *
      ITEMS_PER_PAGE
    );


  return (

    <AsyncWrapper
      loading={loading}
      error={error}
      isEmpty={
        jobs.length === 0
      }
      emptyTitle="
        No tracking jobs
      "
      emptyDescription="
        Upload videos to start realtime AI processing
      "
      errorTitle="
        Failed to load jobs
      "
      errorDescription="
        Unable to fetch tracking jobs
      "
    >

      <SectionCard
        title="
          Recent Tracking Jobs
        "

        subtitle="
          Live AI workload queue
        "

        action={

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            {/* Live Badge */}

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


            <DataPill
              label="Total"
              value={jobs.length}
            />

            <DataPill
              label="Active"
              value={
                jobs.filter(
                  (
                    job
                  ) =>
                    job.status ===
                    "processing"
                ).length
              }
              color="
                text-yellow-400
              "
            />

            <DataPill
              label="Completed"
              value={
                jobs.filter(
                  (
                    job
                  ) =>
                    job.status ===
                    "completed"
                ).length
              }
              color="
                text-green-400
              "
            />

          </div>

        }
      >

        {/* Filters */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-4
            lg:flex-row
          "
        >

          <div className="flex-1">

            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="
                Search by filename or ID
              "
            />

          </div>


          <TableFilter
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              "processing",
              "completed",
              "failed",
            ]}
          />

        </div>


        {/* Table */}

        <div
          className="
            mt-8
            overflow-x-auto
          "
        >

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
                  Job ID
                </th>

                <th className="pb-4">
                  Filename
                </th>

                <th className="pb-4">
                  Status
                </th>

                <th className="pb-4">
                  Progress
                </th>

                <th className="pb-4">
                  Actions
                </th>

                <th className="pb-4">
                  Health
                </th>

              </tr>

            </thead>


            <tbody>

  <AnimatePresence>

    {paginatedJobs.map(
      (job) => (

        <motion.tr
          key={job.id}

          initial={{
            opacity: 0,
            y: 10,
          }}

          animate={{
            opacity: 1,
            y: 0,
          }}

          exit={{
            opacity: 0,
            y: -10,
          }}

          transition={{
            duration: 0.25,
          }}

          className="
            border-b
            border-[#1F2937]
            transition-all
            hover:bg-[#0F172A]
          "
        >

          {/* ID */}

          <td
            className="
              py-5
              text-sm
            "
          >
            #{job.id}
          </td>


          {/* Filename */}

          <td
            className="
              py-5
              text-sm
            "
          >
            {
              job.original_filename
            }
          </td>


          {/* Status */}

          <td
            className="
              py-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              {renderStatusIcon(
                job.status
              )}

              <StatusBadge
                status={
                  job.status
                }
              />

            </div>

          </td>


          {/* Progress */}

          <td
            className="
              py-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  h-2
                  w-[120px]
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
                  "
                  style={{
                    width:
                      `${job.progress}%`,
                  }}
                />

              </div>

              <span
                className="
                  text-sm
                "
              >
                {
                  job.progress
                }
                %
              </span>

            </div>

          </td>


          {/* Actions */}

          <td
            className="
              py-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                opacity-70
                transition-all
                hover:opacity-100
              "
            >

              <button
                onClick={() => {

                  setSelectedJob(
                    job
                  );

                  setModalOpen(
                    true
                  );
                }}

                className="
                  rounded-lg
                  bg-blue-600
                  px-3
                  py-2
                  text-xs
                  font-semibold
                  transition-all
                  hover:bg-blue-500
                "
              >
                View
              </button>


              <button
                className="
                  rounded-lg
                  border
                  border-white/10
                  bg-[#0F172A]
                  p-2
                  transition-all
                  hover:border-blue-500/30
                "
              >

                <Download
                  size={14}
                />

              </button>


              <button
                className="
                  rounded-lg
                  border
                  border-white/10
                  bg-[#0F172A]
                  p-2
                  transition-all
                  hover:border-yellow-500/30
                "
              >

                <RotateCcw
                  size={14}
                />

              </button>

            </div>

          </td>


          {/* Sparkline */}

          <td
            className="
              py-5
            "
          >

            <svg
              width="80"
              height="30"
              viewBox="0 0 80 30"
            >

              <polyline
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                points="
                  0,20
                  10,18
                  20,10
                  30,12
                  40,6
                  50,10
                  60,8
                  70,4
                  80,7
                "
              />

            </svg>

          </td>

        </motion.tr>
      )
    )}

  </AnimatePresence>

</tbody>
          </table>

        </div>


        <Pagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          onPageChange={
            setCurrentPage
          }
        />


        {/* Modal */}

        <Modal
          open={modalOpen}
          title="
            Tracking Job Details
          "
          onClose={() =>
            setModalOpen(false)
          }
        >

          {selectedJob && (

            <div
              className="
                grid
                grid-cols-1
                gap-6
              "
            >

              <SubTaskTrace
                              stages={[

                {
                  id: 1,
                  stage_name: "Received",
                  stage_status: "completed",
                },

                {
                  id: 2,
                  stage_name: "Parsing",
                  stage_status: "completed",
                },

                {
                  id: 3,
                  stage_name: "Inference",

                  stage_status:
                    selectedJob.status ===
                    "processing"

                      ? "active"

                      : "completed",
                },

                {
                  id: 4,
                  stage_name:
                    "ID Assignment",

                  stage_status:
                    selectedJob.status ===
                    "completed"

                      ? "completed"

                      : "pending",
                },

                {
                  id: 5,
                  stage_name:
                    "Finalizing",

                  stage_status:
                    selectedJob.status ===
                    "completed"

                      ? "completed"

                      : "pending",
                },
              ]}
              />


              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-6
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    Job ID
                  </p>

                  <h3
                    className="
                      mt-2
                      text-lg
                      font-bold
                    "
                  >
                    #{selectedJob.id}
                  </h3>

                </div>


                <div>

                  <p
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    Status
                  </p>

                  <div className="mt-2">

                    <StatusBadge
                      status={
                        selectedJob.status
                      }
                    />

                  </div>

                </div>


                <div>

                  <p
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    Filename
                  </p>

                  <h3
                    className="
                      mt-2
                      break-all
                      text-lg
                      font-bold
                    "
                  >
                    {
                      selectedJob.original_filename
                    }
                  </h3>

                </div>


                <div>

                  <p
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    Progress
                  </p>

                  <h3
                    className="
                      mt-2
                      text-lg
                      font-bold
                    "
                  >
                    {
                      selectedJob.progress
                    }
                    %
                  </h3>

                </div>

              </div>

            </div>
          )}

        </Modal>

      </SectionCard>

    </AsyncWrapper>
  );
}

export default RecentJobsTable;