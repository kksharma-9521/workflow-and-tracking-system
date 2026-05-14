export type JobStatus =

  | "queued"
  | "processing"
  | "completed"
  | "failed";


export interface VideoJob {

  id: string;

  original_filename: string;

  status: JobStatus;

  progress: number;

  created_at?: string;

  completed_at?: string;

  output_path?: string;
}