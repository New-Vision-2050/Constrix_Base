import MainLayout from "@/components/shared/layout/main-layout";
import { cookies } from "next/headers";
import React from "react";
import Providers from "./providers";
import withPermissionsProvider from "@/lib/permissions/server/with-permissions-provider";

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const companyCookie = cookieStore.get("company-data")?.value;
  const company = companyCookie ? JSON.parse(companyCookie) : null;

  return (
    <Providers>
      <MainLayout
        mainLogo={company?.logo}
        name={company?.name}
        isCentral={!!company?.is_central_company}
      >
        {children}
      </MainLayout>
    </Providers>
  );
}

export default withPermissionsProvider(RootLayout);
