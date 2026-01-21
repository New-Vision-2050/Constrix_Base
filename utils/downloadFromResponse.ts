import { AxiosResponse } from "axios";

/**
 * Downloads a file from an axios response (blob)
 * @param response - Axios response with blob data
 * @param filename - Optional filename, if not provided will extract from Content-Disposition header or use "export.csv"
 */
export const downloadFromResponse = (
  response: AxiosResponse,
  filename?: string,
) => {
  // Get the filename from the Content-Disposition header or use provided/default
  const contentDisposition = response.headers["content-disposition"];
  let finalFilename = filename || "export.csv";

  if (!filename && contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      finalFilename = filenameMatch[1];
    }
  }

  // Get content type from response headers
  const contentType = response.headers["content-type"] || "text/csv";

  // Create blob and download
  const blob = new Blob([response.data], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
