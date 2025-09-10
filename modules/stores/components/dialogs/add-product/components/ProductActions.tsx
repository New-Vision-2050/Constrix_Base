"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

export default function ProductActions({
  onClose,
  isSubmitting,
  isEditMode = false,
}: ProductActionsProps) {
  const t = useTranslations();

  return (
    <>
      <div className="grid grid-cols-3 gap-6 p-8">
        <Button type="button" variant="outline">
          {t("product.dialog.add.actions.seo")}
        </Button>
        <Button type="button" variant="outline">
          {t("product.dialog.add.actions.additionalDetails")}
        </Button>
        <Button type="button" variant="outline">
          {t("product.dialog.add.actions.customFields")}
        </Button>
      </div>

      <div className="flex gap-4 p-6 border-t border-[#3c345a]">
        <Button type="submit" disabled={isSubmitting} className="flex-1 ">
          {t("labels.save")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 "
        >
          {t("labels.cancel")}
        </Button>
      </div>
    </>
  );
}
