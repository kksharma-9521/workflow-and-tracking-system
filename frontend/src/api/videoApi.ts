import apiClient from "./client";


export async function uploadVideo(
  file: File,
  onUploadProgress?: (
    progress: number
  ) => void
) {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response =
    await apiClient.post(
      "/videos/upload",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },

        onUploadProgress: (
          progressEvent
        ) => {

          const total =
            progressEvent.total ?? 1;

          const progress =
            Math.round(
              (
                progressEvent.loaded /
                total
              ) * 100
            );

          onUploadProgress?.(
            progress
          );
        },
      }
    );

  return response.data;
}


export async function getVideoJob(
  videoJobId: number
) {

  const response =
    await apiClient.get(
      `/videos/${videoJobId}`
    );

  return response.data;
}


export async function getVideoJobs() {

  const response =
    await apiClient.get(
      "/videos/"
    );

  return response.data;
}


export async function getVideoAnalytics(
  videoJobId: number
) {

  const response =
    await apiClient.get(
      `/videos/${videoJobId}/analytics`
    );

  return response.data;
}


export function getDownloadUrl(
  videoJobId: number
) {

  return (
    `http://127.0.0.1:8000/api/videos/` +
    `${videoJobId}/download`
  );
}