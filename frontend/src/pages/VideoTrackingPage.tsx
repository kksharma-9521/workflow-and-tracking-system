import {
  getPersistentIdentities,
  getTrackingFrames,
} from "../api/trackingApi";

import {
  Download,
  Loader2,
  Upload,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

import AnalyticsGrid from "../components/tracking/AnalyticsGrid";

import RecentJobsTable from "../components/tracking/RecentJobsTable";

import LoadingOverlay from "../components/common/LoadingOverlay";

import PageHeader from "../components/common/PageHeader";

import DragDropUpload from "../components/upload/DragDropUpload";

import TrackingOverlay from "../components/tracking/TrackingOverlay";

import PersistentIDGallery from "../components/tracking/PersistentIDGallery";

import ProcessedAssetsPanel from "../components/storage/ProcessedAssetsPanel";

import SystemMetricsChart from "../components/analytics/SystemMetricsChart";

import {
  getDownloadUrl,
  getVideoAnalytics,
  getVideoJob,
  getVideoJobs,
  uploadVideo,
} from "../api/videoApi";

import type {
  VideoJob,
} from "../types/video";

import type {
  PersistentIdentity,
  TrackingFrame,
} from "../types/tracking";


function VideoTrackingPage() {

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  );

  const [
    uploadProgress,
    setUploadProgress,
  ] = useState(0);

  const [
    videoJob,
    setVideoJob,
  ] = useState<VideoJob | null>(
    null
  );

  const [
    analytics,
    setAnalytics,
  ] = useState<any>(null);

  const [
    recentJobs,
    setRecentJobs,
  ] = useState<VideoJob[]>(
    []
  );

  const [
    identities,
    setIdentities,
  ] = useState<
    PersistentIdentity[]
  >([]);

  const [
    trackingData,
    setTrackingData,
  ] = useState<
    TrackingFrame[]
  >([]);

  const videoRef =
    useRef<HTMLVideoElement | null>(
      null
    );


  async function loadRecentJobs() {

    try {

      const jobs =
        await getVideoJobs();

      setRecentJobs(
        jobs
      );

    } catch (error) {

      console.error(
        error
      );
    }
  }


  async function handleUpload() {

    if (!selectedFile)
      return;

    try {

      setUploadProgress(0);

      const response =
        await uploadVideo(
          selectedFile,

          (
            progress
          ) => {

            setUploadProgress(
              progress
            );
          }
        );

      setVideoJob(response);

      toast.success(
        "Video uploaded successfully"
      );

      await loadRecentJobs();

    } catch (error) {

      toast.error(
        "Failed to upload video"
      );

      console.error(error);

    } finally {

      setUploadProgress(0);
    }
  }


  useEffect(() => {

    loadRecentJobs();

  }, []);


  useEffect(() => {

    if (!videoJob)
      return;

    const interval =
      setInterval(
        async () => {

          try {

            const updatedJob =
              await getVideoJob(
                videoJob.id
              );

            setVideoJob(
              updatedJob
            );

            await loadRecentJobs();

            if (
              updatedJob.status ===
              "completed"
            ) {

              const analyticsData =
                await getVideoAnalytics(
                  videoJob.id
                );

              setAnalytics(
                analyticsData
              );

              const trackingFrames =
                await getTrackingFrames(
                  String(videoJob.id)
                );

              setTrackingData(
                trackingFrames
              );

              const identityData =
                await getPersistentIdentities(
                  String(videoJob.id)
                );

              setIdentities(
                identityData
              );

              clearInterval(
                interval
              );
            }

          } catch (error) {

            console.error(
              error
            );
          }
        },
        3000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [videoJob]);


  return (

    <div
      className="
        flex
        flex-col
        gap-8
      "
    >

      {/* Upload Section */}

      <div
        className="
          rounded-2xl
          border
          border-white/5
          bg-[#111827]
          p-8
        "
      >

        <PageHeader
          title="
            Video Tracking Pipeline
          "
          subtitle="
            Enterprise AI-powered
            multi-object tracking orchestration
          "
        />

        <div className="mt-8">

          <DragDropUpload
            onFileSelect={(
              file
            ) => {

              setSelectedFile(
                file
              );
            }}
          />

        </div>

        {/* Upload Progress */}

        {uploadProgress > 0 &&
          uploadProgress < 100 && (

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
                Uploading video...
              </span>

              <span
                className="
                  text-blue-400
                "
              >
                {uploadProgress}%
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
                  duration-300
                "
                style={{
                  width:
                    `${uploadProgress}%`,
                }}
              />

            </div>

          </div>

        )}

        {/* Upload Button */}

        <button
          onClick={
            handleUpload
          }

          disabled={
            uploadProgress > 0 &&
            uploadProgress < 100
          }

          className="
            mt-6
            flex
            items-center
            gap-2
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            transition-all
            hover:bg-blue-500
          "
        >

          {uploadProgress > 0 &&
          uploadProgress < 100 ? (

            <Loader2
              className="
                animate-spin
              "
            />

          ) : (

            <Upload
              size={18}
            />

          )}

          Upload Video

        </button>

      </div>


      {/* Processing Status */}

      {videoJob && (

        <div
          className="
            rounded-2xl
            border
            border-white/5
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
                  text-xl
                  font-bold
                "
              >
                Processing Status
              </h2>

              <p
                className="
                  mt-2
                  capitalize
                  text-gray-400
                "
              >
                {videoJob.status}
              </p>

            </div>

            <div
              className="
                text-3xl
                font-bold
                text-blue-400
              "
            >
              {
                videoJob.progress
              }
              %
            </div>

          </div>

          <div
            className="
              mt-6
              h-4
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
                duration-500
              "
              style={{
                width:
                  `${videoJob.progress}%`,
              }}
            />

          </div>

        </div>

      )}


      {/* Current Processed Video */}

      {videoJob?.status ===
        "completed" && (

        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-white/5
            bg-[#111827]
            p-4
          "
        >

          <div
            className="
              mb-4
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
                Processed Tracking Video
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-400
                "
              >
                Persistent multi-object tracking result
              </p>

            </div>

          </div>

          <div className="relative">

            <video
              ref={videoRef}
              controls
              autoPlay
              className="
                w-full
                rounded-xl
                border
                border-white/5
              "
            >

              <source
                src={`http://localhost:8000/${videoJob.output_path}`}
                type="video/mp4"
              />

            </video>

            <TrackingOverlay
              videoRef={videoRef}
              trackingData={
                trackingData
              }
            />

          </div>

        </div>

      )}


      {/* Analytics */}

      {analytics && (

        <AnalyticsGrid
          analytics={analytics}
        />

      )}

      <SystemMetricsChart
        processedFrames={
          analytics?.processed_frames ?? 0
        }
        detectedObjects={
          analytics?.detected_object_count ?? 0
        }
        skippedFrames={
          analytics?.skipped_frames ?? 0
        }
      />


      {/* Download */}

      {videoJob?.status ===
        "completed" && (

        <a
          href={getDownloadUrl(
            videoJob.id
          )}
          target="_blank"
          rel="noreferrer"
          className="
            flex
            w-fit
            items-center
            gap-2
            rounded-xl
            bg-green-600
            px-6
            py-3
            font-semibold
            transition-all
            hover:bg-green-500
          "
        >

          <Download
            size={18}
          />

          Download Output

        </a>

      )}


      {/* Jobs Table */}

      <RecentJobsTable />


      {/* Previous Processed Outputs */}

      <ProcessedAssetsPanel
        jobs={recentJobs}
      />

      {
        recentJobs.filter(
          (
            job
          ) =>

            job.status ===
            "completed"
        ).length > 0 && (

          <div
            className="
              rounded-2xl
              border
              border-white/5
              bg-[#111827]
              p-8
            "
          >

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
                  Previous Outputs
                </h2>

                <p
                  className="
                    mt-2
                    text-gray-400
                  "
                >
                  Previously completed
                  tracking jobs
                </p>

              </div>

            </div>

            <div
              className="
                grid
                gap-6
                md:grid-cols-2
              "
            >

              {
                recentJobs

                .filter(
                  (
                    job
                  ) =>

                    job.status ===
                    "completed"
                )

                .map(
                  (
                    job
                  ) => (

                    <div
                      key={job.id}
                      className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-white/5
                        bg-[#0F172A]
                      "
                    >

                      <video
                        controls
                        className="
                          aspect-video
                          w-full
                        "
                      >

                        <source
                          src={`http://localhost:8000/${job.output_path}`}
                          type="video/mp4"
                        />

                      </video>

                      <div
                        className="
                          p-4
                        "
                      >

                        <h3
                          className="
                            line-clamp-1
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
                            mt-4
                            flex
                            items-center
                            justify-between
                          "
                        >

                          <div
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
                          </div>

                          <a
                            href={getDownloadUrl(
                              job.id
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              text-sm
                              font-semibold
                              text-blue-400
                              transition-colors
                              hover:text-blue-300
                            "
                          >
                            Download
                          </a>

                        </div>

                      </div>

                    </div>
                  )
                )
              }

            </div>

          </div>
        )
      }


      {/* Identity Gallery */}

      {identities.length > 0 && (

        <div className="mt-8">

          <PersistentIDGallery />

        </div>

      )}


      {/* Loading Overlay */}

      {uploadProgress > 0 &&
        uploadProgress < 100 && (

        <LoadingOverlay />

      )}

    </div>
  );
}

export default VideoTrackingPage;