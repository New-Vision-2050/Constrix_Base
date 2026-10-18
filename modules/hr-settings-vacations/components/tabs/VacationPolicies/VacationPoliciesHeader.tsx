import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { SheetFormBuilder, useFormInstance } from "@/modules/form-builder";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";
import {
  getSetVacationPloicyConfig,
  resolveIsBalanced,
  VACATION_POLICY_FORM_ID,
} from "./SetVacationPloicy/SetVacationPloicyConfig";
import { Button } from "@/components/ui/button";
import { useHRVacationCxt } from "@/modules/hr-settings-vacations/context/hr-vacation-cxt";
import { useLeaveTypes } from "@/modules/hr-settings-vacations/hooks/useLeaveTypes";
import { useLeavePolicyCategories } from "@/modules/hr-settings-vacations/hooks/useLeavePolicyCategories";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

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
  const { data: leaveTypes = [] } = useLeaveTypes();
  const { data: leaveCategories = [] } = useLeavePolicyCategories();
  const { values } = useFormInstance(VACATION_POLICY_FORM_ID);

  const onSuccessFn = () => {
    handleVPRefresh();
    handleCloseVPForm();
  };

  const config = getSetVacationPloicyConfig({
    onSuccessFn,
    t,
    leaveTypes,
    leaveCategories,
    editedPolicy,
  });

  useEffect(() => {
    if (!openVPForm) return;
    useFormStore
      .getState()
      .resetForm(VACATION_POLICY_FORM_ID, config.initialValues || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openVPForm, editedPolicy]);

  if (
    !editedPolicy &&
    resolveIsBalanced(leaveTypes, values?.leave_type_id) === false
  ) {
    config.title = t("form.unpaidTitle");
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-xl font-bold text-white">{t("title")}</h1>
      <Can check={[PERMISSIONS.vacations.settings.leavePolicy.create]}>
        <SheetFormBuilder
          config={config}
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
      </Can>
    </div>
  );
}
