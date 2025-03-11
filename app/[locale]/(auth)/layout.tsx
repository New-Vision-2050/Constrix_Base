"use client";
import AuthLayout from "@/modules/auth/layout";

export default function RootLayout({
  children,
}: Readonly<{

}>) {
  return <AuthLayout>{children}</AuthLayout>;
}
