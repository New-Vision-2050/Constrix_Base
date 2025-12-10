"use client";
import { useFormStore } from "@/modules/form-builder";
import { useEffect, useState } from "react";

interface PeriodUnitSelectorProps {
  formId: string;
  fieldName: "subscription_period_unit" | "trial_period_unit";
}

export function PeriodUnitSelector({ formId, fieldName }: PeriodUnitSelectorProps) {
  const formValues = useFormStore((state) => state.forms[formId]?.values);
  const [value, setValue] = useState(formValues?.[fieldName] || "month");

  useEffect(() => {
    if (formValues?.[fieldName] && formValues[fieldName] !== value) {
      setValue(formValues[fieldName]);
    }
  }, [formValues?.[fieldName]]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    useFormStore.getState().setValues(formId, {
      [fieldName]: newValue,
    });
  };

  return (
    <div className="w-full h-full">
      <select
        className="rounded-lg p-2 bg-transparent border-0 outline-none"
        value={value}
        onChange={handleChange}
      >
        <option value="day" className="bg-white text-black dark:bg-gray-800 dark:text-white">
          يوم
        </option>
        <option value="week" className="bg-white text-black dark:bg-gray-800 dark:text-white">
          أسبوع
        </option>
        <option value="month" className="bg-white text-black dark:bg-gray-800 dark:text-white">
          شهر
        </option>
        <option value="year" className="bg-white text-black dark:bg-gray-800 dark:text-white">
          سنة
        </option>
      </select>
    </div>
  );
}

