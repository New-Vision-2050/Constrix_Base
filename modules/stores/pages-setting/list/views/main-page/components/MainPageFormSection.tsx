"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/modules/table/components/ui/form";
import { Input } from "@/modules/table/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Validation schema
const mainPageSchema = z.object({
  mainTitle: z.string().min(1, { message: "العنوان مطلوب" }),
  mainDescription: z.string().min(1, { message: "الوصف مطلوب" }),
  footerTitle: z.string().min(1, { message: "العنوان مطلوب" }),
  footerDescription: z.string().min(1, { message: "الوصف مطلوب" }),
  footerAddress: z.string().min(1, { message: "العنوان مطلوب" }),
  footerPhone: z.string().min(1, { message: "رقم الهاتف مطلوب" }),
});

type MainPageFormData = z.infer<typeof mainPageSchema>;

interface MainPageFormSectionProps {
  onSuccess?: () => void;
}

export default function MainPageFormSection({
  onSuccess,
}: MainPageFormSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MainPageFormData>({
    resolver: zodResolver(mainPageSchema),
    defaultValues: {
      mainTitle: "",
      mainDescription: "",
      footerTitle: "",
      footerDescription: "",
      footerAddress: "",
      footerPhone: "",
    },
  });

  const onSubmit = async (data: MainPageFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Form data:", data);
      // TODO: Implement API call
      // await MainPageApi.update(data);
      toast.success("تم حفظ التعديلات بنجاح!");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error saving data:", error);
      toast.error("فشل في حفظ التعديلات. حاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (errors: any) => {
    console.log("Validation errors:", errors);
    toast.error("يرجى ملء جميع الحقول المطلوبة بشكل صحيح");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-6 mt-6"
      >
        {/* Main Section Card */}
        <h3 className="text-white text-lg font-semibold">القسم الرئيسي</h3>
        <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="mainTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>العنوان</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>الوصف</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-sidebar" />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Footer Section Card */}
        <h3 className="text-white text-lg font-semibold">
          Footer قسم الذيل
        </h3>
        <div className="bg-sidebar border border-[#3c345a] rounded-lg p-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="footerTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>العنوان</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footerDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>الوصف</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-sidebar" />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footerAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>العنوان</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormErrorMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8"
          >
            {isSubmitting ? "جاري الحفظ..." : "حفظ التعديل"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
