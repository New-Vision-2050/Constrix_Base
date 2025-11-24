import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

/**
 * Error State Component
 * 
 * Displays an error message with retry button
 * Follows Single Responsibility Principle - only handles error UI
 * 
 * @param message - Error message to display
 * @param onRetry - Callback function to retry the failed operation
 */
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const t = useTranslations("content-management-system.termsConditions.form");

  return (
    <div className="px-6 py-4 flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("errorOccurred")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
          {message || t("errorDescription")}
        </p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
        >
          {t("retryButton")}
        </Button>
      )}
    </div>
  );
}

