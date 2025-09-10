"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import type { CreateProductFormData } from "../schema";

interface ProductVATSettingsProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function ProductVATSettings({ form }: ProductVATSettingsProps) {
  const t = useTranslations();
  console.log("Form:", form); // TODO: Remove this and integrate form

  return (
    <Card className="bg-sidebar p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">
          {t("product.dialog.add.fields.vatSettings.exemptFromTax")}
        </Label>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-foreground">
          {t("product.dialog.add.fields.priceIncludesVat.label")}
        </Label>
        <Switch />
      </div>
    </Card>
  );
}
