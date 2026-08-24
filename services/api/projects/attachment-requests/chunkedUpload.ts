import { ChunkedUploadsApi } from "./uploads";

/** Recommended client chunk size per the backend guide. */
export const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

/** Files larger than this go through the chunked-upload flow instead of a direct multipart send. */
export const LARGE_FILE_THRESHOLD = 8 * 1024 * 1024; // 8MB

/** Max retry attempts per chunk before giving up. */
const MAX_CHUNK_RETRIES = 2;

export function isLargeFile(file: File): boolean {
  return file.size > LARGE_FILE_THRESHOLD;
}

export interface UploadLargeFileOptions {
  /** 0–100 overall progress across all chunks. */
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

async function uploadChunkWithRetry(
  uploadId: string,
  chunkIndex: number,
  chunk: Blob,
  fileName: string,
) {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_CHUNK_RETRIES; attempt++) {
    try {
      return await ChunkedUploadsApi.uploadChunk(
        uploadId,
        chunkIndex,
        chunk,
        fileName,
      );
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

/**
 * Uploads a large file in chunks and returns the resulting single-use
 * `upload_id` token to be sent instead of the raw file to
 * `attachment_upload_ids` / `upload_id` on the consuming endpoints.
 */
export async function uploadLargeFile(
  file: File,
  { onProgress }: UploadLargeFileOptions = {},
): Promise<string> {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  const { data: init } = await ChunkedUploadsApi.init({
    file_name: file.name,
    file_size: file.size,
    total_chunks: totalChunks,
    mime_type: file.type || "application/octet-stream",
  });
  const uploadId = init.payload.upload_id;

  for (let index = 0; index < totalChunks; index++) {
    const start = index * CHUNK_SIZE;
    const chunk = file.slice(start, start + CHUNK_SIZE);

    await uploadChunkWithRetry(uploadId, index, chunk, file.name);

    onProgress?.(Math.round(((index + 1) / totalChunks) * 100));
  }

  const { data: completed } = await ChunkedUploadsApi.complete(uploadId);
  return completed.payload.upload_id;
}
