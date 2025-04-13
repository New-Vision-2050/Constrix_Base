import AuthLayout from "@/modules/auth/layout";
import { cookies } from "next/headers";
import React from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const companyCookie = cookieStore.get("company-data")?.value;
  const company = companyCookie ? JSON.parse(companyCookie) : null;
  return <AuthLayout mainLogo={company?.logo}>{children}</AuthLayout>;
}
