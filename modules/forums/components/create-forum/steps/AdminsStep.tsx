"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import EmployeePicker from "../../EmployeePicker";
import InfoNote from "../../ui/InfoNote";
import { useDebounced, useEmployeeSearch } from "../../../hooks/use-lookups";
import type { WizardController } from "../useCreateForumWizard";

export default function AdminsStep({ wizard }: { wizard: WizardController }) {
  const t = useTranslations("Forums");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput);
  const { data: employees, isLoading } = useEmployeeSearch({ search });

  return (
    <div className="flex flex-col gap-4">
      <EmployeePicker
        search={searchInput}
        onSearchChange={setSearchInput}
        employees={employees ?? []}
        loading={isLoading}
        selectedIds={wizard.admins.map((admin) => admin.id)}
        onToggle={wizard.toggleAdmin}
        badgeLabel={t("roles.admin")}
        countLabel={
          wizard.admins.length > 0
            ? t("wizard.admins.selected", { count: wizard.admins.length })
            : undefined
        }
        footer={
          <InfoNote icon={<ShieldCheck />}>
            {t("wizard.admins.transferHint")}
          </InfoNote>
        }
      />

      {wizard.errors.admins ? (
        <p className="text-xs text-destructive">
          {t("wizard.admins.atLeastOne")}
        </p>
      ) : null}
    </div>
  );
}
