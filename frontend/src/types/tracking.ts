export type IdentityStatus =

  | "active"
  | "occluded"
  | "exited";


export interface PersistentIdentity {

  id: number;

  tracking_id: number;

  first_seen: string;

  confidence: number;

  status: IdentityStatus;

  last_seen?: string;

  job_id?: string;
}


export interface TrackingBox {

  id: number;

  x: number;

  y: number;

  width: number;

  height: number;

  confidence: number;
}


export interface TrackingFrame {

  timestamp: number;

  boxes: TrackingBox[];
}