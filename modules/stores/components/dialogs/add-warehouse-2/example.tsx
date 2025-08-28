"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddWarehouse2Dialog from "./index";

export default function AddWarehouse2Example() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    console.log("Warehouse created successfully!");
    // You might want to refresh data or show a success message here
  };

  return (
    <div className="space-y-4">
      <div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          اضافة مخزن (بالموقع)
        </Button>
      </div>

      <AddWarehouse2Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
