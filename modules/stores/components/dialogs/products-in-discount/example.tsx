"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductsInDiscountDialog from "./index";

export default function ProductsInDiscountExample() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditDisplay = () => {
    console.log("Edit display clicked");
    alert("تم النقر على تعديل العرض!");
  };

  return (
    <div>
      <Button
        onClick={() => setIsDialogOpen(true)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        عرض المنتجات في التخفيض
      </Button>

      <ProductsInDiscountDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onEditDisplay={handleEditDisplay}
      />
    </div>
  );
}
