import { post } from "../apiMethod";

const INITIAL_ROUTE = "/documents";

export type UploadResultCode =
  | 'document_processed'
  | 'duplicate_document'
  | 'unsupported_file_type'
  | 'failed';

export type UploadResultStatus =
  | 'processed'
  | 'duplicate_document'
  | 'unsupported_file_type'
  | 'failed';

export interface UploadFileResult {
  filename: string;
  status: UploadResultStatus;
  code?: UploadResultCode;
  message?: string;
  error?: string;
  meta_data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const fileUpload = async (files: File[]): Promise<UploadFileResult[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await post(`${INITIAL_ROUTE}/upload`, formData);
  return response as UploadFileResult[];
};
