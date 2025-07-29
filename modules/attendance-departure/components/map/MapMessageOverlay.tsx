import React from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Loader2, AlertCircle, Info } from "lucide-react";

interface MapMessageOverlayProps {
  type: "loading" | "error" | "noData";
  onRetry?: () => void;
}

const MapMessageOverlay: React.FC<MapMessageOverlayProps> = ({
  type,
  onRetry,
}) => {
  // Get translations
  const t = useTranslations("AttendanceDepartureModule.Map");
  
  // Get current theme
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  // Determine icon and message based on type
  let icon;
  let message;
  let showRetryButton = false;

  switch (type) {
    case "loading":
      icon = <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />;
      message = t("loading");
      break;
    case "error":
      icon = <AlertCircle className="h-10 w-10 text-red-500 mb-2" />;
      message = t("errorLoading");
      showRetryButton = true;
      break;
    case "noData":
      icon = <Info className="h-10 w-10 text-blue-500 mb-2" />;
      message = t("noAttendanceData");
      break;
  }

  return (
    <div
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      } p-4 rounded-lg shadow-lg flex flex-col items-center`}
    >
      {icon}
      <span
        className={`font-medium ${
          isDarkMode ? "text-gray-200" : "text-gray-700"
        }`}
      >
        {message}
      </span>
      {showRetryButton && onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
};

export default MapMessageOverlay;
