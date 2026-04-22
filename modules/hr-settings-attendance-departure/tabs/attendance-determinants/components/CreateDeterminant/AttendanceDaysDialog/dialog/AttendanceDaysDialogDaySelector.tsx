import React, { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
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
> = ({ onChange, value = "", label, placeholder }) => {
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog",
  );
  const locale = useLocale();
  const isArabic = locale === "ar";
  const { usedDays, isEdit } = useAttendanceDayCxt();

  // Convert days to options format based on current locale
  const dayOptions: Option[] = useMemo(() => {
    return DAYS_OF_WEEK.filter((day) => !usedDays?.includes(day.value)).map(
      (day) => ({
        value: day.value,
        label: isArabic ? day.labelAr : day.labelEn,
      })
    );
  }, [usedDays, isArabic]);

  return (
    <div className="mb-4">
      <SearchableSelect
        options={dayOptions}
        defaultValue={value || dayOptions?.[0]?.value}
        value={value}
        onChange={(selectedValue) => onChange?.(selectedValue.toString())}
        label={label || t("Day")}
        placeholder={placeholder || t("selectDay")}
        searchPlaceholder={isArabic ? t("search") : t("search")}
        noResultsText={isArabic ? t("noResults") : t("noResults")}
        disabled={isEdit}
      />
    </div>
  );
};

export default AttendanceDaysDialogDaySelector;
