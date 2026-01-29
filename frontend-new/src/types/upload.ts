// Type definitions for file upload functionality

export interface UploadUrlRequest {
  filename: string;
  contentType: string;
  fileSize?: number;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  url: string;
  key: string;
  expiresIn: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadState {
  uploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  uploadedUrl: string | null;
}
