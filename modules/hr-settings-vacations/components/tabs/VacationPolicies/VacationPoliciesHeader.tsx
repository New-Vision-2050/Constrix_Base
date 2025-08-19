import React from "react";
import { useTranslations } from "next-intl";
import { SheetFormBuilder } from "@/modules/form-builder";
import { getSetVacationPloicyConfig } from "./SetVacationPloicy/SetVacationPloicyConfig";
import { Button } from "@/components/ui/button";
import { useHRVacationCxt } from "@/modules/hr-settings-vacations/context/hr-vacation-cxt";

export default function VacationPoliciesHeader() {
  const t = useTranslations("HRSettingsVacations.leavesPolicies");
  const {
    handleVPRefresh,
    editedPolicy,
    handleCloseVPForm,
    openVPForm,
    handleOpenVPForm,
    handleStoreEditPolicy,
  } = useHRVacationCxt();

  const onSuccessFn = () => {
    // Handle success
    handleVPRefresh();
    handleCloseVPForm();
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-bold text-white">{t("title")}</h1>
      {/* add policy */}
      <SheetFormBuilder
        config={getSetVacationPloicyConfig({
          onSuccessFn,
          t,
          editedPolicy,
        })}
        isOpen={openVPForm}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseVPForm();
          }
        }}
        trigger={
          <Button
            onClick={() => {
              handleStoreEditPolicy(undefined);
              handleOpenVPForm();
            }}
          >
            {t("addNewPolicy")}
          </Button>
        }
      />
    </div>
  );
}
