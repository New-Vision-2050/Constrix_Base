"use client";

import { useTranslations } from "next-intl";
import MultiSelect from "./MultiSelect";
import { useBranchOptions, useProjectOptions } from "../../hooks/use-lookups";

/**
 * The managements + projects pickers shown whenever the visibility scope is
 * `scoped`. `branch_ids` are company-structure units, `project_ids` are projects.
 */
export default function ScopePicker({
  branchIds,
  projectIds,
  onBranchesChange,
  onProjectsChange,
  disabled,
}: {
  branchIds: string[];
  projectIds: string[];
  onBranchesChange: (ids: string[]) => void;
  onProjectsChange: (ids: string[]) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Forums");
  const branches = useBranchOptions();
  const projects = useProjectOptions();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <MultiSelect
        label={t("wizard.basic.managements")}
        placeholder={t("common.allManagements")}
        options={branches.data ?? []}
        value={branchIds}
        onChange={onBranchesChange}
        loading={branches.isLoading}
        disabled={disabled}
      />
      <MultiSelect
        label={t("wizard.basic.projects")}
        placeholder={t("common.allProjects")}
        options={projects.data ?? []}
        value={projectIds}
        onChange={onProjectsChange}
        loading={projects.isLoading}
        disabled={disabled}
      />
    </div>
  );
}
