"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddWarehouseDialog from "./index";

interface WarehouseData {
  product_name: string;
  discount_percentage: number;
  apply_discount_to_product: boolean;
}

export default function AddWarehouseExample() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSuccess = (data: WarehouseData) => {
    console.log("Warehouse created successfully:", data);
    alert("تم اضافة المخزن بنجاح!");
  };

  return (
    <div className="p-4">
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        اضافة مخزن جديد
      </Button>

      <AddWarehouseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
