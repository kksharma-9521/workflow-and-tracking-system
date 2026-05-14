export type WorkflowStageStatus =

  | "pending"
  | "active"
  | "completed"
  | "failed";


export interface WorkflowStage {

  id: number;

  job_id?: string;

  stage_name: string;

  stage_status:
    WorkflowStageStatus;

  updated_at?: string;
}