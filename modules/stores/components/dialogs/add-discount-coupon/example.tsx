"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddDiscountCouponDialog from "./index";

interface DiscountCouponData {
  selected_products: string[];
  discount_percentage: number;
  end_date: string;
  coupon_code: string;
  activate_discount: boolean;
}

export default function AddDiscountCouponExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (data: DiscountCouponData) => {
    console.log("Discount coupon created:", data);
    // Handle success - maybe show a toast or refresh data
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-primary hover:bg-primary/90"
      >
        اضافة كود خصم
      </Button>

      <AddDiscountCouponDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
