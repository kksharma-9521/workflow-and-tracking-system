export interface VideoJob {

  id: number;

  original_filename: string;

  status: string;

  progress: number;

  output_path?: string;

  fps?: number;

  frame_count?: number;

  duration_seconds?: number;

  detected_object_count?: number;

  processing_duration_seconds?: number;
}