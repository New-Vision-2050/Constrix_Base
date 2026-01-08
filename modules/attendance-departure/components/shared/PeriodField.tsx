import React from "react";
import { usePathname } from "@i18n/navigation";
import TimeSelector from "./TimeSelector";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

interface PeriodFieldProps {
  label: string;
  fromValue: string;
  fromPeriod: "AM" | "PM";
  toValue: string;
  toPeriod: "AM" | "PM";
  onFromValueChange?: (value: string) => void;
  onFromPeriodChange?: (period: "AM" | "PM") => void;
  onToValueChange?: (value: string) => void;
  onToPeriodChange?: (period: "AM" | "PM") => void;
  readOnly?: boolean;
  actualHours?: number; // Actual hours worked during this period
  deductedHours?: number; // Hours deducted from this working period
}

/**
 * A fieldset-like component for displaying a time period with from and to times
 */
const PeriodField: React.FC<PeriodFieldProps> = ({
  label,
  fromValue,
  fromPeriod,
  toValue,
  toPeriod,
  onFromValueChange,
  onFromPeriodChange,
  onToValueChange,
  onToPeriodChange,
  readOnly = true,
  actualHours,
  deductedHours,
}) => {
  const pathname = usePathname();

  // Determine direction based on URL path
  // If URL contains /ar/ or starts with /ar, it's Arabic (RTL)
  const isLTR = pathname?.includes("/en/") || pathname?.startsWith("/en");
  const arrowDirection = isLTR ? "→" : "←";

  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  // Theme specific colors
  const bgColor = isDarkMode ? "#0c0c1e" : "#f8fafc";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-300";
  const labelTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const arrowColor = isDarkMode ? "#E91E63" : "#D81B60";

  // Get translations
  const t = useTranslations(
    "AttendanceDepartureModule.Table.dialogs.attendanceStatus"
  );
  const tShared = useTranslations(
    "AttendanceDepartureModule.EmployeeDetailsSheet.times"
  );

  return (
    <div
      className={`border rounded-md p-3 ${borderColor}`}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`text-xs mb-2 border-b pb-2 ${labelTextColor} ${borderColor}`}
      >
        {label}
      </div>
      <div className="flex justify-around items-center">
        <TimeSelector
          label={tShared("from")}
          value={fromValue}
          period={fromPeriod}
          onValueChange={onFromValueChange}
          onPeriodChange={onFromPeriodChange}
          readOnly={readOnly}
        />
        <div className="font-bold" style={{ color: arrowColor }}>
          {arrowDirection}
        </div>
        <TimeSelector
          label={tShared("to")}
          value={toValue}
          period={toPeriod}
          onValueChange={onToValueChange}
          onPeriodChange={onToPeriodChange}
          readOnly={readOnly}
        />
      </div>

      {/* Display actual and deducted hours information if available */}
      {(actualHours !== undefined || deductedHours !== undefined) && (
        <div className="mt-3 pt-2 border-t text-xs grid grid-cols-2 gap-2">
          {actualHours !== undefined && (
            <div>
              <span className={labelTextColor}>{t("actualHours")}:</span>
              <span className="font-medium ml-1">{actualHours}</span>
            </div>
          )}
          {deductedHours !== undefined && (
            <div>
              <span className={labelTextColor}>{t("deductedHours")}:</span>
              <span className="font-medium ml-1">{deductedHours}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PeriodField;
