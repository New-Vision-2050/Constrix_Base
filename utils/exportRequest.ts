import { baseApi } from "@/config/axios/instances/base";
import { AxiosRequestConfig } from "axios";

export type ExportAdditionalParams = {
  search?: string;
  searchFields?: string[];
} & Record<string, unknown>;

/**
 * Creates an export request function for a given API path
 * @param path - The API endpoint path (e.g., "job_titles/export")
 * @returns A function that accepts ids, additional params, and config
 */
export const exportRequest = (path: string) => {
  return (
    ids?: string[],
    additionalParams?: ExportAdditionalParams,
    config?: AxiosRequestConfig,
  ) => {
    return baseApi.post(
      path,
      {
        ids,
        format: "csv",
        ...additionalParams,
      },
      {
        responseType: "blob",
        ...config,
      },
    );
  };
};
