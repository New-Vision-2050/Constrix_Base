import { Button } from "@/components/ui/button";
import { useAttendanceDeterminants } from "../context/AttendanceDeterminantsContext";
import { SheetFormBuilder } from "@/modules/form-builder";
import { createDeterminantFormConfig, getDynamicDeterminantFormConfig } from "./CreateDeterminant/CreateDeterminantFormConfig";
import { useState, useEffect } from "react";
import { useFormStore } from "@/modules/form-builder/hooks/useFormStore";

export default function TabHeader() {
  const { showAllDeterminants, activeDeterminant } = useAttendanceDeterminants();
  const [formConfig, setFormConfig] = useState(createDeterminantFormConfig);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Listen to form changes to update wizard sections dynamically
  useEffect(() => {
    if (!isFormOpen) return;

    const interval = setInterval(() => {
      const formValues = useFormStore?.getState().getValues("create-determinant-form");
      if (formValues?.working_days && Array.isArray(formValues.working_days)) {
        const newConfig = getDynamicDeterminantFormConfig(formValues.working_days);
        setFormConfig(newConfig);
      }
    }, 500); // Check every 500ms

    return () => clearInterval(interval);
  }, [isFormOpen]);

  const handleFormOpen = () => {
    setIsFormOpen(true);
    setFormConfig(createDeterminantFormConfig); // Reset to base config
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setFormConfig(createDeterminantFormConfig); // Reset to base config
  };

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <h2 className="text-xl font-bold">
        {showAllDeterminants ? "جميع المحددات" : activeDeterminant?.location}
      </h2>
      <div className="flex gap-2">
        <SheetFormBuilder
          config={formConfig}
          trigger={<Button>إنشاء محدد</Button>}
          onOpen={handleFormOpen}
          onClose={handleFormClose}
        />
      </div>
    </div>
  );
}
