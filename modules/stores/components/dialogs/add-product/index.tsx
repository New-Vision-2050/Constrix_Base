"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { X } from "lucide-react";
import {
  ProductImageUpload,
  ProductBasicInfo,
  ProductInventoryInfo,
  ProductSettings,
  ProductVATSettings,
  ProductVisibilitySettings,
  VATTable,
  ProductActions,
} from "./components";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddProductDialog({
  open,
  onClose,
}: AddProductDialogProps) {
  const isRtl = useIsRtl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Implement submit logic
      console.log("Submit product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl w-full" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            إضافة منتج عادي
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="w-5 h-5 text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Product Image Upload Section */}
            <div className="col-span-4">
              <ProductImageUpload />
            </div>
            {/* Product Information Section */}
            <div className="col-span-8 space-y-6">
              <ProductBasicInfo />
              <ProductInventoryInfo
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                selectedMainCategory={selectedMainCategory}
                setSelectedMainCategory={setSelectedMainCategory}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
              />
              <ProductSettings />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* VAT and Visibility Settings */}
            <div className="col-span-4 space-y-6">
              <ProductVATSettings />
              <ProductVisibilitySettings />
            </div>
            {/* VAT Table */}
            <div className="col-span-8 space-y-6">
              <VATTable />
            </div>
          </div>
        </div>

        <ProductActions
          onSubmit={handleSubmit}
          onClose={handleClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
