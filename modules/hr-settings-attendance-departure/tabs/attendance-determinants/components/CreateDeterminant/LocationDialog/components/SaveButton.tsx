import React from "react";
import { useLocationDialog } from "../context/LocationDialogContext";
import { useFormStore } from "@/modules/form-builder";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

interface SaveButtonProps {
  onSave: () => void;
}

export default function SaveButton({ onSave }: SaveButtonProps) {
  const { selectedBranches, branchesMap, getBranchLocation } = useLocationDialog();
  const { resolvedTheme } = useTheme();
  const t = useTranslations("location");

  const handleSave = () => {
    // Create array of branch data for console output
    const branchesData = selectedBranches.map((branchId) => {
      const branchData = getBranchLocation(branchId);
      const branchName = branchesMap[branchId] || branchId;

      return {
        branchId,
        branchName,
        isDefaultLocation: branchData.isDefault,
        latitude: branchData.latitude,
        longitude: branchData.longitude,
        radius: branchData.radius,
      };
    });

    // Log branch data for debugging
    console.log("Branch data:", branchesData, JSON.stringify(branchesData));

    // create-determinant-form
    // branch_locations
    useFormStore
      ?.getState()
      .setValue("create-determinant-form", "branch_locations", JSON.stringify(branchesData));
    
    onSave();
  };

  return (
    <button
      onClick={handleSave}
      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 rounded-lg transition-colors"
    >
      {t("save")}
    </button>
  );
}
