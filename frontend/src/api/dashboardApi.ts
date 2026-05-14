import apiClient from "./client";


export async function getVideoJobs() {

  const response =
    await apiClient.get(
      "/videos"
    );

  return response.data;
}


export async function getDashboardMetrics() {

  const jobs =
    await getVideoJobs();

  const totalJobs =
    jobs.length;

  const completedJobs =
    jobs.filter(
      (
        job: any
      ) =>
        job.status ===
        "completed"
    ).length;

  const processingJobs =
    jobs.filter(
      (
        job: any
      ) =>
        job.status ===
        "processing"
    ).length;

  const failedJobs =
    jobs.filter(
      (
        job: any
      ) =>
        job.status ===
        "failed"
    ).length;

  return {

    totalJobs,

    completedJobs,

    processingJobs,

    failedJobs,
  };
}