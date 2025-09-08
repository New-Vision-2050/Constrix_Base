"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import type { CreateProductFormData } from "../schema";

interface ProductVATSettingsProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function ProductVATSettings({ form }: ProductVATSettingsProps) {
  console.log("Form:", form); // TODO: Remove this and integrate form
  return (
    <Card className="bg-sidebar p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">المنتج معفى من الضريبة</Label>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-foreground">
          السعر شامل ضريبة القيمة المضافة
        </Label>
        <Switch />
      </div>
    </Card>
  );
}
