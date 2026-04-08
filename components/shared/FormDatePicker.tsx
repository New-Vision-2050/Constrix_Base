"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldValues, UseFormRegister, FieldErrors, Path } from "react-hook-form";

interface FormDatePickerProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  label: string;
  errors?: FieldErrors<T>;
  disabled?: boolean;
}

export default function FormDatePicker<T extends FieldValues>({
  register,
  name,
  label,
  errors,
  disabled = false,
}: FormDatePickerProps<T>) {
  const error = errors?.[name];

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm text-gray-400">
        {label}
      </Label>
      <Input
        id={name}
        variant="secondary"
        type="date"
        {...register(name)}
        disabled={disabled}
      />
      {error && (
        <p className="text-red-500 text-sm">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
