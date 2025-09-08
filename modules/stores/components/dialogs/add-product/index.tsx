"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Form } from "@/modules/table/components/ui/form";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { X } from "lucide-react";
import { toast } from "sonner";
import { ProductsApi } from "@/services/api/ecommerce/products";
import type { CreateProductParams } from "@/services/api/ecommerce/products/types/params";
import { createProductSchema, type CreateProductFormData } from "./schema";
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
  onSuccess?: () => void;
}

export default function AddProductDialog({
  open,
  onClose,
  onSuccess,
}: AddProductDialogProps) {
  const isRtl = useIsRtl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      sku: "",
      stock: 0,
      warehouse_id: "",
      requires_shipping: 1,
      unlimited_quantity: 0,
      is_taxable: 1,
      price_includes_vat: 0,
      vat_percentage: "0",
      is_visible: 1,
      category_id: "",
      brand_id: "",
      sub_category_id: "",
      type: "physical",
      taxes: [],
      details: [],
      custom_fields: [],
      seo: {
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
      },
      associated_product_ids: [],
    },
  });

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  console.log("errors", form.formState.errors);

  const onSubmit = async (data: CreateProductFormData) => {
    setIsSubmitting(true);
    try {
      // Transform form data to API params
      const apiParams: CreateProductParams = {
        ...data,
        // Convert File objects to the expected format if needed
        main_image: data.main_image,
        other_images: data.other_images,
      };

      const response = await ProductsApi.create(apiParams);

      if (response.data) {
        toast.success("تم إنشاء المنتج بنجاح");
        handleClose();
        onSuccess?.();
      }
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      toast.error("حدث خطأ أثناء إنشاء المنتج");
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 space-y-8"
          >
            <div className="grid grid-cols-12 gap-8">
              {/* Product Image Upload Section */}
              <div className="col-span-4">
                <ProductImageUpload form={form} />
              </div>
              {/* Product Information Section */}
              <div className="col-span-8 space-y-6">
                <ProductBasicInfo form={form} />
                <ProductInventoryInfo form={form} />
                <ProductSettings form={form} />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* VAT and Visibility Settings */}
              <div className="col-span-4 space-y-6">
                <ProductVATSettings form={form} />
                <ProductVisibilitySettings form={form} />
              </div>
              {/* VAT Table */}
              <div className="col-span-8 space-y-6">
                <VATTable form={form} />
              </div>
            </div>

            <ProductActions onClose={handleClose} isSubmitting={isSubmitting} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
