"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import EmployeePicker from "../../EmployeePicker";
import InfoNote from "../../ui/InfoNote";
import { SelectFilter } from "../../ui/FilterCard";
import {
  useBranchOptions,
  useDebounced,
  useEmployeeSearch,
  useProjectOptions,
} from "../../../hooks/use-lookups";
import type { WizardController } from "../useCreateForumWizard";

export default function MembersStep({ wizard }: { wizard: WizardController }) {
  const t = useTranslations("Forums");

  const [searchInput, setSearchInput] = useState("");
  // These two only narrow the picker; they are never part of the request.
  const [branchId, setBranchId] = useState("");
  const [projectId, setProjectId] = useState("");

  const search = useDebounced(searchInput);
  const branches = useBranchOptions();
  const projects = useProjectOptions();
  const { data: employees, isLoading } = useEmployeeSearch({
    search,
    branch_id: branchId || undefined,
    project_id: projectId || undefined,
  });

  return (
    <EmployeePicker
      search={searchInput}
      onSearchChange={setSearchInput}
      employees={employees ?? []}
      loading={isLoading}
      selectedIds={wizard.members.map((member) => member.id)}
      onToggle={wizard.toggleMember}
      badgeLabel={t("roles.member")}
      countLabel={t("wizard.members.selected", {
        count: wizard.members.length,
      })}
      onClearSelection={wizard.clearMembers}
      clearLabel={t("wizard.members.clearSelection")}
      filters={
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectFilter
            label={t("common.management")}
            value={branchId}
            onChange={setBranchId}
            allLabel={t("common.allManagements")}
            options={(branches.data ?? []).map((option) => ({
              value: option.id,
              label: option.name,
            }))}
          />
          <SelectFilter
            label={t("common.project")}
            value={projectId}
            onChange={setProjectId}
            allLabel={t("common.allProjects")}
            options={(projects.data ?? []).map((option) => ({
              value: option.id,
              label: option.name,
            }))}
          />
        </div>
      }
      footer={
        <InfoNote icon={<Users />}>
          {t("wizard.members.distributionHint")}
        </InfoNote>
      }
    />
  );
}
