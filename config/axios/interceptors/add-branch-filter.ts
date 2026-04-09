import type { InternalAxiosRequestConfig } from "axios";
import { getCookie } from "cookies-next";

const BRANCH_SCOPED_SUFFIXES = [
  "/sub_entities/records/list",
  "/sub_entities/records/widgets",
  "/company-users/clients",
  "/company-users/brokers",
  "/company-users/employees",
  "/company-users/clients/widgets",
  "/company-users/brokers/widgets",
  "/client-requests"
] as const;

function getPathname(urlWithoutQuery: string): string {
  try {
    if (
      urlWithoutQuery.startsWith("http://") ||
      urlWithoutQuery.startsWith("https://")
    ) {
      return new URL(urlWithoutQuery).pathname.replace(/\/+$/, "") || "";
    }
    const path = urlWithoutQuery.startsWith("/")
      ? urlWithoutQuery
      : `/${urlWithoutQuery}`;
    return path.replace(/\/+$/, "") || "";
  } catch {
    return "";
  }
}

function isBranchScopedPath(pathname: string): boolean {
  return BRANCH_SCOPED_SUFFIXES.some((suffix) => pathname.endsWith(suffix));
}

function hasBranchIdInRequest(
  config: InternalAxiosRequestConfig,
  rawUrl: string
): boolean {
  const params = config.params;
  if (
    params &&
    typeof params === "object" &&
    !Array.isArray(params) &&
    !(params instanceof URLSearchParams) &&
    "branch_id" in params &&
    params.branch_id !== undefined &&
    params.branch_id !== null &&
    params.branch_id !== ""
  ) {
    return true;
  }
  const qIndex = rawUrl.indexOf("?");
  if (qIndex === -1) return false;
  const sp = new URLSearchParams(rawUrl.slice(qIndex + 1));
  const v = sp.get("branch_id");
  return v !== null && v !== "";
}

function mergeParams(
  existing: InternalAxiosRequestConfig["params"],
  branchId: string
): Record<string, unknown> {
  const base =
    existing &&
    typeof existing === "object" &&
    !Array.isArray(existing) &&
    !(existing instanceof URLSearchParams)
      ? { ...(existing as Record<string, unknown>) }
      : {};
  return { ...base, branch_id: branchId };
}

/**
 * Appends `branch_id` from `current-branch-id` cookie to GET list requests that
 * should respect the header branch filter (sub-entity lists, company-users lists, widgets).
 */
export const addBranchFilterParam = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (typeof window === "undefined") return config;
  if ((config.method || "get").toLowerCase() !== "get") return config;

  const rawUrl = config.url;
  if (!rawUrl) return config;

  const urlWithoutQuery = rawUrl.split("?")[0];
  const pathname = getPathname(urlWithoutQuery);
  if (!isBranchScopedPath(pathname)) return config;

  if (hasBranchIdInRequest(config, rawUrl)) return config;

  const branchId = getCookie("current-branch-id");
  if (!branchId || String(branchId).trim() === "") return config;

  const id = String(branchId);

  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    const u = new URL(rawUrl);
    u.searchParams.set("branch_id", id);
    config.url = u.toString();
  } else {
    config.params = mergeParams(config.params, id);
  }

  return config;
};
