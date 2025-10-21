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

  return (
    <div className="flex items-center space-x-8 space-x-reverse">
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch
          id="tax-switch"
          checked={form.watch("is_taxable") === 1}
          onCheckedChange={(checked) =>
            form.setValue("is_taxable", checked ? 1 : 0)
          }
        />
        <Label htmlFor="tax-switch" className="text-foreground">
          {t("product.dialog.add.fields.isTaxable.label")}
        </Label>
      </div>
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch
          id="shipping-switch"
          checked={form.watch("requires_shipping") === 1}
          onCheckedChange={(checked) =>
            form.setValue("requires_shipping", checked ? 1 : 0)
          }
        />
        <Label htmlFor="shipping-switch" className="text-foreground">
          {t("product.dialog.add.fields.requiresShipping.label")}
        </Label>
      </div>
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch
          id="unlimited-qty-switch"
          checked={form.watch("unlimited_quantity") === 1}
          onCheckedChange={(checked) =>
            form.setValue("unlimited_quantity", checked ? 1 : 0)
          }
        />
        <Label htmlFor="unlimited-qty-switch" className="text-foreground">
          {t("product.dialog.add.fields.unlimitedQuantity.label")}
        </Label>
      </div>
    </div>
  );
}
