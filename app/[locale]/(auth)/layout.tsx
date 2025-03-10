import AuthLayout from "@/modules/auth/layout";
import TableBuilder from "@/modules/table/components/TableBuilder";
import { usersConfig } from "@/modules/table/utils/configs/usersConfig";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
