import PrivacyPolicyView from "@/modules/legal/privacy-policy";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("PrivacyPolicy");

  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
