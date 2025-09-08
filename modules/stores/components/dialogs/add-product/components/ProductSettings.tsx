"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ProductSettings() {
  return (
    <div className="flex items-center space-x-8 space-x-reverse">
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch id="tax-switch" />
        <Label htmlFor="tax-switch" className="text-foreground">
          الضريبة
        </Label>
      </div>
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch id="shipping-switch" />
        <Label htmlFor="shipping-switch" className="text-foreground">
          تتطلب شحن
        </Label>
      </div>
      <div className="flex items-center space-x-3 space-x-reverse">
        <Switch id="unlimited-qty-switch" />
        <Label htmlFor="unlimited-qty-switch" className="text-foreground">
          كمية غير محدودة
        </Label>
      </div>
    </div>
  );
}
