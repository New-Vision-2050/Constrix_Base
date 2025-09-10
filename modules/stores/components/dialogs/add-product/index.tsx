"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
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
import type {
  CreateProductParams,
  UpdateProductParams,
} from "@/services/api/ecommerce/products/types/params";
import {
  createProductSchemaForMode,
  type CreateProductFormData,
} from "./schema";
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
  editingProductId?: string;
}

export default function AddProductDialog({
  open,
  onClose,
  onSuccess,
  editingProductId,
}: AddProductDialogProps) {
  const isEditMode = !!editingProductId;
  const t = useTranslations();
  const isRtl = useIsRtl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchemaForMode(isEditMode)),
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

  // Fetch product data when editing
  const { data: productData, isLoading: isFetching } = useQuery({
    queryKey: ["product", editingProductId],
    queryFn: () => ProductsApi.show(editingProductId!),
    enabled: isEditMode && open,
  });

  // Populate form with product data when editing
  React.useEffect(() => {
    if (isEditMode && productData?.data?.payload) {
      const product = productData.data.payload;

      form.setValue("name", product.name || "");
      form.setValue("description", product.description || "");
      form.setValue("price", product.price?.toString() || "");
      form.setValue("sku", product.sku || "");
      form.setValue("stock", product.stock || 0);
      form.setValue("warehouse_id", product.warehouse_id || "");
      form.setValue("requires_shipping", product.requires_shipping || 1);
      form.setValue("unlimited_quantity", product.unlimited_quantity || 0);
      form.setValue("is_taxable", product.is_taxable || 1);
      form.setValue("price_includes_vat", product.price_includes_vat || 0);
      form.setValue(
        "vat_percentage",
        product.vat_percentage?.toString() || "0"
      );
      form.setValue("is_visible", product.is_visible || 1);
      form.setValue("category_id", product.category?.id || "");
      form.setValue("brand_id", product.brand?.id || "");
      form.setValue(
        "type",
        (product.type as "physical" | "digital") || "physical"
      );
      form.setValue(
        "taxes",
        product.taxes?.map((tax) => ({
          country_id: tax.country?.id ? parseInt(tax.country.id) : 0,
          tax_number: tax.tax_number || "",
          tax_percentage: tax.tax_percentage?.toString() || "0",
          is_active: tax.is_active || 1,
        })) || []
      );
      form.setValue("details", product.details || []);
      form.setValue("custom_fields", product.custom_fields || []);
      form.setValue(
        "seo",
        product.seo || {
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
        }
      );
      form.setValue(
        "associated_product_ids",
        product.associated_product?.map((p) => p.id) || []
      );

      // Handle images - in edit mode, we don't require new files if images already exist
      if (product.main_image) {
        // Set a placeholder or existing image reference
        form.setValue("main_image", product.main_image);
      }
      if (product.other_images?.length) {
        form.setValue("other_images", product.other_images);
      }
    }
  }, [isEditMode, productData, form]);

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      form.reset();
      onClose();
    }
  };

  console.log("errors", form.formState.errors);

  const onSubmit = async (data: CreateProductFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && editingProductId) {
        // Transform form data to update API params
        const updateParams: UpdateProductParams = {
          ...data,
          main_image:
            data.main_image instanceof File ? data.main_image : undefined,
          other_images: data.other_images?.filter((img) => img instanceof File),
        };

        const response = await ProductsApi.update(
          editingProductId,
          updateParams
        );

        if (response.data) {
          toast.success(t("product.dialog.edit.success"));
          handleClose();
          onSuccess?.();
        }
      } else {
        // Transform form data to create API params
        const apiParams: CreateProductParams = {
          ...data,
          // Convert File objects to the expected format if needed
          main_image: data.main_image,
          other_images: data.other_images,
        };

        const response = await ProductsApi.create(apiParams);

        if (response.data) {
          toast.success(t("product.dialog.add.success"));
          handleClose();
          onSuccess?.();
        }
      }
    } catch (error: unknown) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} product:`,
        error
      );
      toast.error(
        t(isEditMode ? "product.dialog.edit.error" : "product.dialog.add.error")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl w-full" dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-foreground">
            {t(
              isEditMode
                ? "product.dialog.edit.title"
                : "product.dialog.add.title"
            )}
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

            <ProductActions
              onClose={handleClose}
              isSubmitting={isSubmitting}
              isEditMode={isEditMode}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
