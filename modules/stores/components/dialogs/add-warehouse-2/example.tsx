"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AddWarehouse2Dialog from "./index";

interface Warehouse2Data {
  warehouse_name: string;
  virtual_location_enabled: boolean;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  street: string;
  location: string;
}

export default function AddWarehouse2Example() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = (data: Warehouse2Data) => {
    console.log("Warehouse 2 created:", data);
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
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
