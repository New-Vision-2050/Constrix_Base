"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

// import Checkbox from "@/components/shared/Checkbox";

export default function ClientsSettings() {
  const t = useTranslations("CRMSettingsModule.ClientsSettings");
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Checkbox />
        <Label>{t("shareClientsData")}</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox />
        <Label>{t("shareBrokersData")}</Label>
      </div>
    </div>
  );
}
