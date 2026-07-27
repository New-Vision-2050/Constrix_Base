import { getCookie } from "cookies-next";
import { ROUTER } from "@/router";

export function getPostLoginRedirectPath() {
  const companyCookie = getCookie("company-data");
  if (companyCookie) {
    try {
      const company = JSON.parse(companyCookie as string);
      if (!company?.is_central_company) {
        return ROUTER.AttendancePresence;
      }
    } catch {
      // malformed cookie, fall back to default below
    }
  }
  return ROUTER.USER_PROFILE;
}
