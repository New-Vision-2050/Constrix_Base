"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddOrderDiscountDialog from "./index";

interface OrderDiscountData {
  total_order_value: number;
  discount_percentage: number;
  apply_discount_to_order: boolean;
  selected_products: string[];
}

export default function AddOrderDiscountExample() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = (data: OrderDiscountData) => {
    console.log("Order discount created successfully:", data);
    alert("تم اضافة التخفيض على الطلب بنجاح!");
  };

  return (
    <div className="p-4">
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        اضافة تخفيض على اجمالي طلب
      </Button>

      <AddOrderDiscountDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
