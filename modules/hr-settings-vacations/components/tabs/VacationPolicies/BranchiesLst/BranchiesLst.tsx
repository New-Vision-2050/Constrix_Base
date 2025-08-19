/**
 * BranchiesLst component - displays a list of branch items
 */
import React, { useState } from "react";
import BranchItem from "./BranchItem";
import { useHRVacationCxt } from "@/modules/hr-settings-vacations/context/hr-vacation-cxt";
import { useTranslations } from "next-intl";

interface Branch {
  id: string;
  name: string;
}

interface BranchiesLstProps {
  /** Optional className for styling */
  className?: string;
}

/**
 * Displays a list of branches with selection functionality
 */
const BranchiesLst: React.FC<BranchiesLstProps> = ({ className = "" }) => {
  const t = useTranslations("HRSettingsVacations.leavesPolicies");
  const { branches, selectedBranchId, handleBranchSelect } = useHRVacationCxt();

  return (
    <div className={`space-y-2 ${className}`}>
      <BranchItem
        key={"all-branches"}
        label={t("allBranches")}
        isActive={selectedBranchId === null}
        onClick={() => {
          handleBranchSelect(null);
        }}
      />
      {branches.map((branch) => (
        <BranchItem
          key={branch.id}
          label={branch.name}
          isActive={selectedBranchId === +branch.id}
          onClick={() => {
            handleBranchSelect(+branch.id);
          }}
        />
      ))}
    </div>
  );
};

export default BranchiesLst;
