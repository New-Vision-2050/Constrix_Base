"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Form } from "@/modules/table/components/ui/form";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductFormFields from "./components/ProductFormFields";
import ProductInventoryFields from "./components/ProductInventoryFields";

// Simplified schema for the new form
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  product_type: z.string().optional(),
  serial_number: z.string().optional(),
  type_toggle: z.boolean().default(false),
  // Inventory fields
  device: z.string().optional(),
  electronic_device: z.string().optional(),
  preventive: z.string().optional(),
  product_category: z.string().optional(),
  source: z.array(z.string()).optional(),
  question_source: z.string().optional(),
  weight: z.string().optional(),
  commercial_unit: z.string().optional(),
  weight_unit: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductView() {
  const t = useTranslations();
  const isRtl = useIsRtl();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("ar");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      product_type: "",
      serial_number: "",
      type_toggle: false,
      // Inventory defaults
      device: "",
      electronic_device: "",
      preventive: "",
      product_category: "",
      source: [],
      question_source: "",
      weight: "",
      commercial_unit: "",
      weight_unit: "kg",
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form data:", data);
      toast.success("Product created successfully!");
      router.push("/stores/products");
    } catch (error) {
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/stores/products");
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="max-w-8xl mx-auto p-6">
        {/* Page Header */}
        <h2 className="text-white text-lg font-semibold mb-6">
          إضافة منتج جديد
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
                dir="rtl"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-sidebar">
                  <TabsTrigger value="ar" className="text-sm">
                    اللغة العربية (AR)
                  </TabsTrigger>
                  <TabsTrigger value="en" className="text-sm">
                    اللغة الإنجليزية (EN)
                  </TabsTrigger>
                </TabsList>

                {/* Arabic Tab */}
                <TabsContent value="ar" className="space-y-6">
                  <ProductFormFields form={form} language="ar" />
                </TabsContent>

                {/* English Tab */}
                <TabsContent value="en" className="space-y-6">
                  <ProductFormFields form={form} language="en" />
                </TabsContent>
              </Tabs>
            </div>

            {/* Inventory Fields Card */}
            <h3 className="text-white text-lg font-semibold mb-6">
              الاعداد العام
            </h3>
            <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
              <ProductInventoryFields form={form} />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
