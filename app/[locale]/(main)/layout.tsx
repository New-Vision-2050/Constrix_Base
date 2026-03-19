import MainLayout from "@/components/shared/layout/main-layout";
import { cookies } from "next/headers";
import React from "react";
import Providers from "./providers";
import withPermissionsProvider from "@/lib/permissions/server/with-permissions-provider";
import { usersApi } from "@/services/api/users";
import { redirect } from "next/navigation";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";

async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const nvToken = cookieStore.get("new-vision-token")?.value;

  if (!nvToken) {
    redirect(`/${locale}/login`);
  }

  let userTypes: UserRoleType[] = [];
  try {
    const meData = await usersApi.getMe();
    userTypes = meData?.data?.payload?.user_types ?? [];
  } catch {
    redirect(`/api/auth/clear-token?locale=${locale}`);
  }

  const companyCookie = cookieStore.get("company-data")?.value;
  const company = companyCookie ? JSON.parse(companyCookie) : null;

  return (
    <Providers>
      <MainLayout
        mainLogo={company?.logo}
        name={company?.name}
        userTypes={userTypes}
        isCentral={!!company?.is_central_company}
      >
        {children}
      </MainLayout>
    </Providers>
  );
}

export default withPermissionsProvider(RootLayout);
