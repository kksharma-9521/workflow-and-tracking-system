export type WorkflowStageStatus =

  | "pending"
  | "active"
  | "completed"
  | "failed";


export interface WorkflowStage {

  id: number;

  label: string;

  status: WorkflowStageStatus;
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


export interface PersistentIdentity {

  id: number;

  firstSeen: string;

  confidence: number;

  status:
    | "active"
    | "occluded"
    | "exited";
}