"use client";

import { useTranslations } from "next-intl";
import { ReactNode } from "react";

interface CanSeeContentProps {
  canSee: boolean;
  children: ReactNode;
}

const CanSeeContent = ({ canSee, children }: CanSeeContentProps) => {
  const t = useTranslations("Shared");

  if (!canSee) {
    return (
      <div className="text-destructive p-2 px-8 rounded bg-destructive/10">
        {t("NotAuthorized")}
      </div>
    );
  }

  return <>{children}</>;
};

export default CanSeeContent;
