"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SheetFormBuilder, useFormStore } from "@/modules/form-builder";
import { Button } from "@/components/ui/button";
import { getSetPublicVacationFormConfig } from "./SetPublicVacationFormConfig";

type Props = {
  year: number;
  branchId: string;
  onSuccess: () => void;
};

export default function PublicVacationsAddSheet({
  year,
  branchId,
  onSuccess,
}: Props) {
  const t = useTranslations("HRSettingsVacations.publicLeaves.table");

  const formConfig = useMemo(
    () =>
      getSetPublicVacationFormConfig(t, onSuccess, {
        year,
        branchId,
      }),
    [t, onSuccess, year, branchId]
  );

  const resetAddForm = () => {
    useFormStore.getState().resetForm(
      formConfig.formId || "public-vacations-add-form",
      formConfig.initialValues ?? {}
    );
  };

  return (
    <SheetFormBuilder
      config={formConfig}
      onSuccess={onSuccess}
      trigger={
        <Button type="button" onClick={resetAddForm}>
          {t("addPublicVacation")}
        </Button>
      }
    />
  );
}
