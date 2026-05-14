import axios from "axios";

import type {
  PersistentIdentity,
  TrackingFrame,
} from "../types/tracking";


const API_BASE =
  "http://localhost:8000";


export async function
getTrackingFrames(
  jobId: string
): Promise<
  TrackingFrame[]
> {

  const response =
    await axios.get(
      `${API_BASE}/jobs/${jobId}/tracking`
    );

  return response.data;
}


export async function
getPersistentIdentities(
  jobId: string
): Promise<
  PersistentIdentity[]
> {

  const response =
    await axios.get(
      `${API_BASE}/jobs/${jobId}/identities`
    );

  return response.data;
}