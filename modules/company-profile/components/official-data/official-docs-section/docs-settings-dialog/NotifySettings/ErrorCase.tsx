import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function NotifyErrorCase({ refetch }: { refetch: () => void }) {
  const t = useTranslations(
    "companyProfile.officialDocs.docsSettingsDialog.notifyErrorCase"
  );

  return (
    <div className="flex flex-col items-center justify-center w-full p-8 min-h-[400px]">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="mr-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              {t("title")}
            </h3>
          </div>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300 mb-4">
          {t("description")}
        </p>
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
          onClick={() => refetch()}
        >
          {t("retry")}
        </Button>
      </div>
    </div>
  );
}
