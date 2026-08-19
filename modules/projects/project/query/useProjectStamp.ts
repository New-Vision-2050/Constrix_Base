import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ProjectStampApi,
  resolveStampUrlFromApiBody,
} from "@/services/api/projects/project-stamp";

export type ProjectStampQueryData = {
  raw: unknown;
  url: string | null;
};

export const projectStampQueryKey = (projectId?: string) =>
  projectId
    ? (["project-stamp", projectId] as const)
    : (["project-stamp"] as const);

async function parseStampResponse(
  blob: Blob,
  contentTypeHeader?: string,
): Promise<ProjectStampQueryData> {
  const contentType = (
    blob.type ||
    contentTypeHeader ||
    ""
  ).toLowerCase();

  if (contentType.startsWith("image/")) {
    return { raw: null, url: URL.createObjectURL(blob) };
  }

  const text = (await blob.text()).trim();
  if (!text) return { raw: null, url: null };

  try {
    const body = JSON.parse(text) as unknown;
    const payload =
      body && typeof body === "object" && "payload" in body
        ? (body as { payload?: unknown }).payload
        : body;
    return {
      raw: payload ?? null,
      url: resolveStampUrlFromApiBody(body),
    };
  } catch {
    if (text.startsWith("\uFFFD") || contentType.includes("octet-stream")) {
      const imageBlob = new Blob([blob], { type: blob.type || "image/png" });
      return { raw: null, url: URL.createObjectURL(imageBlob) };
    }
    return { raw: null, url: null };
  }
}

export function useProjectStamp(projectId: string | undefined) {
  return useQuery({
    queryKey: projectStampQueryKey(projectId),
    queryFn: async (): Promise<ProjectStampQueryData> => {
      try {
        const res = await ProjectStampApi.getAsBlob(projectId!);
        const headerType = String(res.headers["content-type"] ?? "");
        return parseStampResponse(res.data, headerType);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return { raw: null, url: null };
        }
        throw error;
      }
    },
    enabled: !!projectId,
    retry: false,
  });
}
