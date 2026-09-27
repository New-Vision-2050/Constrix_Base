"use client";

import { Input } from "@/modules/table/components/ui/input";
import { Label } from "@/modules/table/components/ui/label";
import { useFormInstance } from "@/modules/form-builder/hooks/useFormStore";
import { countHolidayDays } from "@/modules/hr-settings-vacations/utils/holiday-dates";

type HolidayDaysCountFieldProps = {
  formId: string;
  label: string;
  year: number;
};

export default function HolidayDaysCountField({
  formId,
  label,
  year,
}: HolidayDaysCountFieldProps) {
  const { values } = useFormInstance(formId);
  const days = countHolidayDays(values.date_start, values.date_end, year);
  const display = days != null ? String(days) : "";

  return (
    <div className="space-y-2">
      <Label htmlFor="holiday-days-count">{label}</Label>
      <Input
        id="holiday-days-count"
        type="text"
        value={display}
        disabled
        readOnly
        className="w-full bg-muted"
        tabIndex={-1}
      />
    </div>
  );
}
