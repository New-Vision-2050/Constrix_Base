import axios, { type AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import { serialize } from "object-to-formdata";
import { baseURL } from "@/config/axios-config";
import { getCurrentHost } from "@/utils/get-current-host";

/**
 * Dedicated client for `api/v1/forum/...`.
 *
 * It deliberately does not reuse `apiClient`: that instance signs the user out on
 * every 403, while the forum API answers 403 for "this forum is not yours" —
 * a case the spec wants handled by sending the user back to the forums list.
 */
export const forumClient = axios.create({
  baseURL: `${baseURL}/forum`,
});

forumClient.interceptors.request.use(async (config) => {
  const token = getCookie("new-vision-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const lang = getCookie("NEXT_LOCALE") || "ar";
  config.headers.Lang = lang;
  config.headers["Accept-Language"] = lang;

  if (typeof window !== "undefined") {
    const host = await getCurrentHost();
    if (host) config.headers["X-Domain"] = host;
  }

  return config;
});

export type ListEnvelope<TRow, TStats = undefined> = {
  items: TRow[];
  pagination: {
    page: number;
    next_page: number | null;
    last_page: number;
    result_count: number;
  };
  stats: TStats;
  can_create: boolean;
};

/** Reads the shared list envelope: `payload` array with `pagination` / `stats` siblings. */
export function readList<TRow, TStats = undefined>(
  response: AxiosResponse,
): ListEnvelope<TRow, TStats> {
  const data = response?.data ?? {};
  const items: TRow[] = Array.isArray(data.payload) ? data.payload : [];

  return {
    items,
    pagination: {
      page: data.pagination?.page ?? 1,
      next_page: data.pagination?.next_page ?? null,
      last_page: data.pagination?.last_page ?? 1,
      result_count: data.pagination?.result_count ?? items.length,
    },
    stats: (data.stats ?? {}) as TStats,
    can_create: Boolean(data.can_create),
  };
}

/** Reads a single-object `payload`. */
export function readPayload<T>(response: AxiosResponse): T {
  return (response?.data?.payload ?? null) as T;
}

/** Drops empty filter values so they never reach the query string. */
export function cleanParams<T extends Record<string, unknown>>(
  params: T,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
}

/**
 * Builds a multipart body. `indices` keeps nested arrays such as
 * `admins[0][user_id]` groupable on the Laravel side.
 */
export function toFormData(body: Record<string, unknown>): FormData {
  return serialize(body, { indices: true, nullsAsUndefineds: true });
}

/** `true` when a plain JSON body is enough (no file in the payload). */
export function hasFile(...candidates: unknown[]): boolean {
  return candidates.some(
    (candidate) =>
      candidate instanceof File ||
      (Array.isArray(candidate) &&
        candidate.some((item) => item instanceof File)),
  );
}

/** Field-level validation errors returned with a 422. */
export function readValidationErrors(
  error: unknown,
): Record<string, string[]> | undefined {
  const response = (error as { response?: { status?: number; data?: unknown } })
    ?.response;
  if (response?.status !== 422) return undefined;
  const errors = (response.data as { errors?: unknown })?.errors;
  if (!errors || typeof errors !== "object") return undefined;

  return Object.fromEntries(
    Object.entries(errors as Record<string, unknown>).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.map(String) : [String(value)],
    ]),
  );
}

/** `true` when the forum API answers "not yours". */
export function isForbidden(error: unknown): boolean {
  return (
    (error as { response?: { status?: number } })?.response?.status === 403
  );
}

/** `true` when the resource is gone (deleted group / announcement). */
export function isNotFound(error: unknown): boolean {
  return (
    (error as { response?: { status?: number } })?.response?.status === 404
  );
}
