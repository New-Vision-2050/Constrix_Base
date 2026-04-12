"use client";

import { PropsWithChildren } from "react";
import "nextjs-breadcrumbs/dist/index.css";
import { EchoProvider } from "@/providers/echo-provider";

function Providers({
  children,
  companyId,
}: PropsWithChildren<{ companyId?: string }>) {
  if (!companyId) return <>{children}</>;
  return <EchoProvider companyId={companyId}>{children}</EchoProvider>;
}

export default Providers;
