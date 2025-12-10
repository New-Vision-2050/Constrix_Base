"use client";
import { useFormStore } from "@/modules/form-builder";
import { useEffect, useState } from "react";

export function CurrencySelector({ formId }: { formId: string }) {
  const formValues = useFormStore((state) => state.forms[formId]?.values);
  const [value, setValue] = useState(formValues?.currency || "EGP");

  useEffect(() => {
    if (formValues?.currency && formValues.currency !== value) {
      setValue(formValues.currency);
    }
  }, [formValues?.currency]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    useFormStore.getState().setValues(formId, {
      currency: newValue,
    });
  };

  return (
    <div className="w-full h-full">
      <select
        className="rounded-lg p-2 bg-transparent border-0 outline-none"
        value={value}
        onChange={handleChange}
      >
        <option value="SAR" className="bg-white text-black dark:bg-gray-800 dark:text-white">
          ر.س
        </option>
        <option value="EGP" className="bg-white text-black dark:bg-gray-800 dark:text-white">
          ج.م
        </option>
      </select>
    </div>
  );
}

