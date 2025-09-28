"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ErrorCase({ refetch }: { refetch: () => void }) {
  const t = useTranslations(
    "companyProfile.officialDocs.docsSettingsDialog.errorCase"
  );
  
  return (
    <div className="w-full p-6">
      <div className="mx-auto max-w-lg rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-100">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">{t("title")}</h3>
            <p className="mt-1 text-xs text-red-200/90">{t("description")}</p>
            <div className="mt-3">
              <Button
                onClick={() => refetch()}
                variant="secondary"
                className="h-8 px-3"
              >
                {t("retry")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
