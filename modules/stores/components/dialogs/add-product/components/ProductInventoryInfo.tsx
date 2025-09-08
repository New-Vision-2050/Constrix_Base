"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/modules/table/components/ui/input";
import SimpleSelect from "@/components/headless/select";

interface ProductInventoryInfoProps {
  selectedStore: string;
  setSelectedStore: (value: string) => void;
  selectedMainCategory: string;
  setSelectedMainCategory: (value: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (value: string) => void;
}

export default function ProductInventoryInfo({
  selectedStore,
  setSelectedStore,
  selectedMainCategory,
  setSelectedMainCategory,
  selectedSubCategory,
  setSelectedSubCategory,
}: ProductInventoryInfoProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">المخزن</Label>
        <SimpleSelect
          value={selectedStore}
          onValueChange={setSelectedStore}
          options={[{ label: "مخزن جدة", value: "jeddah_warehouse" }]}
          valueProps={{
            placeholder: "اختر المخزن",
          }}
        />
      </div>
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">الكمية</Label>
        <Input placeholder="8000" type="number" />
      </div>
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">
          التصنيف الرئيسي
        </Label>
        <SimpleSelect
          value={selectedMainCategory}
          onValueChange={setSelectedMainCategory}
          options={[{ label: "الكترونيات", value: "electronics" }]}
          valueProps={{
            placeholder: "اختر التصنيف الرئيسي",
          }}
        />
      </div>
      <div>
        <Label className="text-gray-400 text-sm mb-2 block">
          التصنيف الفرعي
        </Label>
        <SimpleSelect
          value={selectedSubCategory}
          onValueChange={setSelectedSubCategory}
          options={[{ label: "أجهزة", value: "devices" }]}
          valueProps={{
            placeholder: "اختر التصنيف الفرعي",
          }}
        />
      </div>
    </div>
  );
}
