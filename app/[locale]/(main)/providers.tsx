"use client";

import { BreadcrumbsProvider } from "@/lib/breadcrumbs";
import { PropsWithChildren } from "react";

function Providers({ children }: PropsWithChildren) {
  return <BreadcrumbsProvider>{children}</BreadcrumbsProvider>;
}

export default Providers;
