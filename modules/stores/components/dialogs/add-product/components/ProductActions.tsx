"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export default function ProductActions({
  onClose,
  isSubmitting,
}: ProductActionsProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-6 p-8">
        <Button type="button" variant="outline">
          تحسين محركات البحث
        </Button>
        <Button type="button" variant="outline">
          تفاصيل اضافية للمنتج
        </Button>
        <Button type="button" variant="outline">
          حقول مخصصة
        </Button>
      </div>

      <div className="flex gap-4 p-6 border-t border-[#3c345a]">
        <Button type="submit" disabled={isSubmitting} className="flex-1 ">
          {isSubmitting ? "جاري الحفظ..." : "حفظ"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 "
        >
          الغاء
        </Button>
      </div>
    </>
  );
}
