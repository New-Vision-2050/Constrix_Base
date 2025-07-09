import MainLayout from "@/components/shared/layout/main-layout";
import { cookies } from "next/headers";
import React from "react";
import { AbilityProviderWrapper } from "../AbilityProviderWrapper";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const companyCookie = cookieStore.get("company-data")?.value;
  const company = companyCookie ? JSON.parse(companyCookie) : null;

  return (
    <AbilityProviderWrapper>
      <MainLayout
        mainLogo={company?.logo}
        name={company?.name}
        isCentral={!!company?.is_central_company}
      >
        {children}
      </MainLayout>
    </AbilityProviderWrapper>
  );
}
