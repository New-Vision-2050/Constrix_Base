"use client";

import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "../../utils/format";
import { WIZARD_STEPS, type WizardStep } from "./useCreateForumWizard";

/** The four numbered step chips; completed steps show a check. */
export default function WizardStepper({
  current,
  onSelect,
}: {
  current: WizardStep;
  onSelect: (step: WizardStep) => void;
}) {
  const t = useTranslations("Forums.wizard.steps");
  const locale = useLocale();
  const currentIndex = WIZARD_STEPS.indexOf(current);

  return (
    <div className="flex items-center gap-2">
      {WIZARD_STEPS.map((step, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <button
            key={step}
            type="button"
            onClick={() => (isDone ? onSelect(step) : undefined)}
            disabled={!isDone && !isActive}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs transition-colors",
              isActive && "border-primary bg-primary/10 font-medium text-foreground",
              isDone && "border-emerald-500/40 bg-emerald-500/10 text-foreground",
              !isActive && !isDone && "border-border text-muted-foreground",
            )}
          >
            <span>{formatNumber(index + 1, locale)}</span>
            {isDone ? (
              <Check className="size-3 text-emerald-400" />
            ) : (
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  isActive ? "bg-primary" : "bg-muted-foreground",
                )}
              />
            )}
            <span className="hidden sm:inline">{t(step)}</span>
          </button>
        );
      })}
    </div>
  );
}
