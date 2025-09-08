"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

export default function ProductVisibilitySettings() {
  return (
    <Card className="bg-sidebar p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-foreground">عرض المنتج على المتجر</Label>
        <Switch defaultChecked />
      </div>
      <p className="text-gray-400 text-sm">
        في حالة عدم اختيارك عرض المنتج على المتجر سيتم حفظ المنتج في المنتجات
        ولن يتم اظهاره للمستخدم على المتجر الخاص بك
      </p>
    </Card>
  );
}
