import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";

type EmptyStateProps = {
  message?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  const { resolvedTheme } = useTheme();
  const t = useTranslations(
    "HRSettingsAttendanceDepartureModule.attendanceDeterminants.form.AttendanceDaysDialog"
  );

  // Default message if not provided
  const displayMessage = message || t("noPeriods");
  
  // Default icon if not provided
  const displayIcon = icon || <AlertCircle className="h-10 w-10 text-amber-500" />;

  return (
    <div className={`
      flex flex-col items-center justify-center p-8 gap-4 rounded-lg
      ${resolvedTheme === "dark" ? "bg-gray-800/50" : "bg-gray-100"}
      border-2 border-dashed ${resolvedTheme === "dark" ? "border-gray-700" : "border-gray-300"}
    `}>
      {displayIcon}
      <p className={`text-center font-medium ${resolvedTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
        {displayMessage}
      </p>
    </div>
  );
}
