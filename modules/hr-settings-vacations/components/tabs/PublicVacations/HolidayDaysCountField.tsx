"use client";

import { Input } from "@/modules/table/components/ui/input";
import { Label } from "@/modules/table/components/ui/label";
import { useFormInstance } from "@/modules/form-builder/hooks/useFormStore";
import { countHolidayDays } from "@/modules/hr-settings-vacations/utils/holiday-dates";

const FORM_ID = "public-vacations-form";

type HolidayDaysCountFieldProps = {
  label: string;
  year: number;
};

export default function HolidayDaysCountField({
  label,
  year,
}: HolidayDaysCountFieldProps) {
  const { values } = useFormInstance(FORM_ID);
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
