import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

// Re-export useParams, useSesarchParams, and notFound from next/navigation
// These are not locale-aware but are commonly used
export { useParams, useSearchParams, notFound } from "next/navigation";
