"use client";
import AuthLayout from "@/modules/auth/layout";
import React, {useState} from "react";

export default function RootLayout({
  children,
}: Readonly<{

}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
