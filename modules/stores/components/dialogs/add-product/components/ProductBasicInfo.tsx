"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/modules/table/components/ui/input";

export default function ProductBasicInfo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="text-gray-400 text-sm mb-2 block">اسم المنتج</Label>
          <Input placeholder="هاتف ايفون" />
        </div>
        <div>
          <Label className="text-gray-400 text-sm mb-2 block">سعر المنتج</Label>
          <Input placeholder="1600" type="number" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label className="text-gray-400 text-sm mb-2 block">رمز المنتج</Label>
          <Input placeholder="16AAFF206" />
        </div>
        <div>
          <Label className="text-gray-400 text-sm mb-2 block">وصف المنتج</Label>
          <Input placeholder="وصف هذا المنتج الذي قد يكون سطرا أو يتجاوز ذلك بـ..." />
        </div>
      </div>
    </div>
  );
}
