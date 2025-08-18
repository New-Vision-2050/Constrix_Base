import React from "react";
import { useTranslations } from "next-intl";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetVacationPloicyConfig } from "./SetVacationPloicy/SetVacationPloicyConfig";
import { Button } from "@/components/ui/button";

export default function VacationPoliciesHeader() {
  const t = useTranslations("HRSettingsVacations.leavesPolicies");
  const onSuccessFn = () => {
    // Handle success
  };
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-bold text-white">{t("title")}</h1>
      {/* add policy */}
      <SheetFormBuilder
        config={getSetVacationPloicyConfig({
          onSuccessFn,
          t,
        })}
        trigger={<Button>{t("addNewPolicy")}</Button>}
      />
    </div>
  );
}
