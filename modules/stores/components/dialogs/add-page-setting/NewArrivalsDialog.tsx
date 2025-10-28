"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormLabel from "@/components/shared/FormLabel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { apiClient } from "@/config/axios-config";

const createPageSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, "الاسم مطلوب"),
    type: z.string().min(1, "النوع مطلوب"),
    image: z.any().optional(),
  });

type PageFormData = z.infer<ReturnType<typeof createPageSchema>>;

interface NewArrivalsDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  pageId?: string;
}

export function NewArrivalsDialog({ open, onClose, onSuccess, pageId }: NewArrivalsDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!pageId;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: pageData, isLoading: isFetching } = useQuery({
    queryKey: ["page-new-arrivals", pageId],
    queryFn: () => apiClient.get(`/ecommerce/dashboard/pages/new-arrivals/${pageId}`),
    enabled: isEditMode && open,
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<PageFormData>({
    resolver: zodResolver(createPageSchema(t)),
    defaultValues: { name: "", type: "الوصول جديدنا" },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) toast.error(firstError.message as string);
    }
  }, [errors]);

  useEffect(() => {
    if (!open) {
      reset({ name: "", type: "الوصول جديدنا" });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [open, reset]);

  useEffect(() => {
    if (isEditMode && pageData?.data?.payload && open) {
      const page = pageData.data.payload;
      reset({ name: page.name || "", type: page.type || "الوصول جديدنا" });
      if (page.image) setImagePreview(page.image);
    }
  }, [isEditMode, pageData, open, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (imageFile) formData.append("image", imageFile);

      if (isEditMode && pageId) {
        await apiClient.put(`/ecommerce/dashboard/pages/new-arrivals/${pageId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post("/ecommerce/dashboard/pages/new-arrivals", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(isEditMode ? "تم تحديث الصفحة بنجاح" : "تم إنشاء الصفحة بنجاح");
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          toast.error(validationErrors[firstErrorKey][0]);
          return;
        }
      }
      toast.error(isEditMode ? "فشل تحديث الصفحة" : "فشل إنشاء الصفحة");
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isSubmitting && !isFetching && onClose()}>
      <DialogContent className={`max-w-md w-full bg-sidebar border-gray-700 ${isRtl ? "rtl" : "ltr"}`} dir={isRtl ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? "تعديل صفحة" : "اضافة لقة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <FormLabel required className="text-xs text-gray-400">نوع الصفحة</FormLabel>
            <Select value={watch("type")} onValueChange={(value) => setValue("type", value)} disabled={isSubmitting || isFetching}>
              <SelectTrigger className="mt-1 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="الوصول جديدنا">الوصول جديدنا</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <FormLabel className="text-xs text-gray-400">صورة صفحة الرئيسية</FormLabel>
            <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-6 bg-gray-900/50">
              {imagePreview ? (
                <div className="relative w-full">
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded" />
                  <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">×</button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-400 mb-1">2160 × 2160</p>
                  <p className="text-xs text-gray-500 mb-3">3MB - الحجم الأقصى</p>
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg text-sm">ارفاق</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isSubmitting || isFetching} />
                  </label>
                </>
              )}
            </div>
          </div>
          <div>
            <FormLabel required className="text-xs text-gray-400">اسم الصفحة</FormLabel>
            <Input {...register("name")} disabled={isSubmitting || isFetching} placeholder="اسم الصفحة" className="mt-1 bg-gray-900 border-gray-700 text-white" />
          </div>
          <Button type="submit" disabled={isSubmitting || isFetching} className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white">
            {(isSubmitting || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            حفظ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
