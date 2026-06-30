import PublicLegalLayout from "@/modules/legal/components/public-legal-layout";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPolicyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const companyCookie = cookieStore.get("company-data")?.value;
  const company = companyCookie ? JSON.parse(companyCookie) : null;
  const t = await getTranslations("PrivacyPolicy");

  return (
    <PublicLegalLayout
      mainLogo={company?.logo}
      companyName={company?.name}
      pageTitle={t("title")}
    >
      {children}
    </PublicLegalLayout>
  );
}
