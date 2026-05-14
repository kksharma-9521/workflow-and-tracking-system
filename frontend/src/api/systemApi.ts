import apiClient from "./client";


export async function getSystemHealth() {

  const response =
    await apiClient.get(
      "/health"
    );

  return response.data;
}