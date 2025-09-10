"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CreateProductFormData } from "../schema";

interface ProductSettingsProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function ProductSettings({ form }: ProductSettingsProps) {
  const t = useTranslations();
  console.log("Form:", form); // TODO: Remove this and integrate form

  return (
    <div className="flex items-center space-x-8 space-x-reverse">
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch id="tax-switch" />
        <Label htmlFor="tax-switch" className="text-foreground">
          {t("product.dialog.add.fields.isTaxable.label")}
        </Label>
      </div>
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch id="shipping-switch" />
        <Label htmlFor="shipping-switch" className="text-foreground">
          {t("product.dialog.add.fields.requiresShipping.label")}
        </Label>
      </div>
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch id="unlimited-qty-switch" />
        <Label htmlFor="unlimited-qty-switch" className="text-foreground">
          {t("product.dialog.add.fields.unlimitedQuantity.label")}
        </Label>
      </div>
    </div>
  );
}
