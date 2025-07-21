import React from "react";
import { useLocationDialog } from "../context/LocationDialogContext";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

// Branch data type definition
interface Branch {
  id: string;
  name: string;
}

interface BranchSelectorProps {
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

export default function BranchSelector({
  selectedBranch,
  onBranchChange,
}: BranchSelectorProps) {
  const { selectedBranches, branchesMap } = useLocationDialog();
  const { resolvedTheme } = useTheme();
  const t = useTranslations("location");
  
  // Convert selected branches to list
  const branches: Branch[] = selectedBranches.map((branchId: string) => ({
    id: branchId,
    name: branchesMap[branchId] || branchId,
  }));

  return (
    <div className="mb-6 text-center">
      <div className="flex gap-2 justify-center items-center">
        <label className="block text-gray-700 dark:text-white text-sm mb-3">{t("selectBranch")}:</label>
        {branches.map((branch: Branch) => (
          <button
            key={branch.id}
            onClick={() => onBranchChange(branch.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedBranch === branch.id
                ? "bg-pink-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {branch.name}
          </button>
        ))}
      </div>
    </div>
  );
}
