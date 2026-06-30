import PrivacyPolicyLayout from "@/modules/legal/components/privacy-policy-layout";
import { getTranslations } from "next-intl/server";

export default async function PrivacyPolicyRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = await getTranslations("PrivacyPolicy");

  return (
    <PrivacyPolicyLayout pageTitle={t("title")}>
      {children}
    </PrivacyPolicyLayout>
  );
}
