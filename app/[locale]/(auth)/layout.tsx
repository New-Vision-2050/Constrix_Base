import AuthLayout from "@/modules/auth/layout";
import InfoIcon from "@/public/icons/info";
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

  return (
    <>
      {!!company ? (
        <AuthLayout mainLogo={company?.logo}>{children}</AuthLayout>
      ) : (
        <AuthLayout mainLogo={company?.logo}>
          <div className="flex flex-col items-center justify-center gap-5">
            <InfoIcon />
            <h1 className="text-2xl">الشركة غير موجودة او غير مفعلة</h1>
          </div>
        </AuthLayout>
      )}
    </>
  );
}
