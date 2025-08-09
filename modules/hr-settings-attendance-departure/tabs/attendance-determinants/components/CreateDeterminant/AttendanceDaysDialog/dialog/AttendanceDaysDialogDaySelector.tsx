import React, { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { DAYS_OF_WEEK } from "../constants/days";
import { Option } from "@/components/shared/SearchableSelect";
import { useAttendanceDayCxt } from "../context/AttendanceDayCxt";

type AttendanceDaysDialogDaySelectorProps = {
  onChange?: (day: string) => void;
  value?: string;
  label?: string;
  placeholder?: string;
};

const AttendanceDaysDialogDaySelector: React.FC<
  AttendanceDaysDialogDaySelectorProps
> = ({ onChange, value = "", label = "اليوم", placeholder = "اختر اليوم" }) => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { usedDays } = useAttendanceDayCxt();

  // Convert days to options format based on current locale
  const dayOptions: Option[] = useMemo(() => {
    return DAYS_OF_WEEK.filter((day) => !usedDays?.includes(day.value)).map(
      (day) => ({
        value: day.value,
        label: isArabic ? day.labelAr : day.labelEn,
      })
    );
  }, [usedDays]);

  return (
    <div className="mb-4">
      <SearchableSelect
        options={dayOptions}
        defaultValue={value || dayOptions?.[0]?.value}
        value={value}
        onChange={(selectedValue) => onChange?.(selectedValue.toString())}
        label={label}
        placeholder={placeholder}
        searchPlaceholder={isArabic ? "البحث..." : "Search..."}
        noResultsText={isArabic ? "لا توجد نتائج" : "No results"}
      />
    </div>
  );
};

export default AttendanceDaysDialogDaySelector;
