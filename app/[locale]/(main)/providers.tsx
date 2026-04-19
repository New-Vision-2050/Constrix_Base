"use client";

import { PropsWithChildren } from "react";
import "nextjs-breadcrumbs/dist/index.css";
import { EchoProvider } from "@/providers/echo-provider";
import { BreadcrumbProvider } from "@/components/shared/breadcrumbs";

function Providers({
  children,
  companyId,
}: PropsWithChildren<{ companyId?: string }>) {
  if (!companyId) return <BreadcrumbProvider>{children}</BreadcrumbProvider>;
  return (
    <BreadcrumbProvider>
      <EchoProvider companyId={companyId}>{children}</EchoProvider>
    </BreadcrumbProvider>
  );
}

export default Providers;
