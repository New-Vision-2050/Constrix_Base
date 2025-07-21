import React from "react";
import { useLocationDialog } from "../context/LocationDialogContext";
import { useTheme } from "next-themes";

interface BranchSelectorProps {
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
}

export default function BranchSelector({
  selectedBranch,
  onBranchChange,
}: BranchSelectorProps) {
  const { selectedBranches, branchesMap } = useLocationDialog();
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';
  
  // Theme-specific colors
  const labelColor = isDarkMode ? 'text-white' : 'text-gray-700';
  const inactiveButtonBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
  const inactiveButtonText = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const inactiveButtonHover = isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300';
  
  // Branch data type definition
  interface Branch {
    id: string;
    name: string;
  }
  
  // Convert selected branches to list
  const branches: Branch[] = selectedBranches.map((branchId: string) => ({
    id: branchId,
    name: branchesMap[branchId] || branchId,
  }));

  return (
    <div className="mb-6 text-center">
      <div className="flex gap-2 justify-center items-center">
        <label className={`block ${labelColor} text-sm mb-3`}>اختيار الفرع:</label>
        {branches.map((branch: Branch) => (
          <button
            key={branch.id}
            onClick={() => onBranchChange(branch.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedBranch === branch.id
                ? "bg-pink-500 text-white"
                : `${inactiveButtonBg} ${inactiveButtonText} ${inactiveButtonHover}`
            }`}
          >
            {branch.name}
          </button>
        ))}
      </div>
    </div>
  );
}
