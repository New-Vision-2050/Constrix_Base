"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

export default function ProductVATSettings() {
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
