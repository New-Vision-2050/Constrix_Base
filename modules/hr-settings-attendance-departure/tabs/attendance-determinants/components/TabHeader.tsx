import { Button } from "@/components/ui/button";
import { useAttendanceDeterminants } from "../context/AttendanceDeterminantsContext";
import { SheetFormBuilder } from "@/modules/form-builder";
import { createDeterminantFormConfig, getDynamicDeterminantFormConfig } from "./CreateDeterminant/CreateDeterminantFormConfig";
import { useState, useEffect } from "react";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";

export default function TabHeader() {
  const { activeConstraint } = useAttendanceDeterminants();
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [formConfig, setFormConfig] = useState(() => {
    // Add onSheetOpenChange to the base config
    return {
      ...createDeterminantFormConfig,
      onSheetOpenChange: (open: boolean) => {
        setIsFormOpen(open);
        if (open) {
          // Reset to base config when opening
          setFormConfig((prev) => ({
            ...createDeterminantFormConfig,
            onSheetOpenChange: prev.onSheetOpenChange
          }));
        }
      }
    };
  });

  // Listen to form changes to update wizard sections dynamically
  useEffect(() => {
    if (!isFormOpen) return;

    const interval = setInterval(() => {
      const formValues = useFormStore?.getState().getValues("create-determinant-form");
      if (formValues?.working_days && Array.isArray(formValues.working_days)) {
        // Get the updated config
        const newConfig = getDynamicDeterminantFormConfig(formValues.working_days);
        
        // Preserve the onSheetOpenChange from the current config
        setFormConfig((prevConfig) => ({
          ...newConfig,
          onSheetOpenChange: prevConfig.onSheetOpenChange
        }));
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, [isFormOpen]);

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h2 className="text-xl font-bold">
        {!activeConstraint ? "جميع المحددات" : activeConstraint?.constraint_name}
      </h2>
      <div className="flex gap-2">
        <SheetFormBuilder
          config={formConfig}
          trigger={<Button>إنشاء محدد</Button>}
        />
      </div>
    </div>
  );
}
