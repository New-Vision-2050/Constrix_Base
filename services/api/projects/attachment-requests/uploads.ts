import { baseApi } from "@/config/axios/instances/base";
import { ApiBaseResponse } from "@/types/common/response/base";
import {
  ChunkedUploadSession,
  CompletedChunkedUpload,
  InitChunkedUploadParams,
} from "./types/params";

const BASE = "projects/attachment-requests/uploads";

export const ChunkedUploadsApi = {
  /** POST `.../uploads/init` */
  init: (params: InitChunkedUploadParams) =>
    baseApi.post<ApiBaseResponse<ChunkedUploadSession>>(
      `${BASE}/init`,
      params,
    ),

  /** POST `.../uploads/{upload_id}/chunk` (multipart) */
  uploadChunk: (
    uploadId: string,
    chunkIndex: number,
    chunk: Blob,
    fileName: string,
  ) => {
    const formData = new FormData();
    formData.append("chunk_index", String(chunkIndex));
    formData.append("chunk", chunk, fileName);
    return baseApi.post<ApiBaseResponse<ChunkedUploadSession>>(
      `${BASE}/${uploadId}/chunk`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  /** GET `.../uploads/{upload_id}/status` */
  getStatus: (uploadId: string) =>
    baseApi.get<ApiBaseResponse<ChunkedUploadSession>>(
      `${BASE}/${uploadId}/status`,
    ),

  /** POST `.../uploads/{upload_id}/complete` */
  complete: (uploadId: string) =>
    baseApi.post<ApiBaseResponse<CompletedChunkedUpload>>(
      `${BASE}/${uploadId}/complete`,
    ),

  /** DELETE `.../uploads/{upload_id}` */
  abort: (uploadId: string) => baseApi.delete(`${BASE}/${uploadId}`),
};
