"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import type { CreateProductFormData } from "../schema";

interface ProductVisibilitySettingsProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function ProductVisibilitySettings({
  form,
}: ProductVisibilitySettingsProps) {
  const t = useTranslations();
  console.log("Form:", form); // TODO: Remove this and integrate form

  return (
    <Card className="bg-sidebar p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">
          {t("product.dialog.add.fields.isVisible.label")}
        </Label>
        <Switch defaultChecked />
      </div>
      <p className="text-gray-400 text-sm">
        {t("product.dialog.add.fields.isVisible.description")}
      </p>
    </Card>
  );
}
