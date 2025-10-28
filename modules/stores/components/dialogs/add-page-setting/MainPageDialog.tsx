"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FormLabel from "@/components/shared/FormLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { toast } from "sonner";
import { apiClient } from "@/config/axios-config";
import ImageUpload from "@/components/shared/ImageUpload";
import { Textarea } from "@/modules/table/components/ui/textarea";

const createPageSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, "الاسم مطلوب"),
    type: z.string().min(1, "النوع مطلوب"),
    link: z.string().optional(),
    image: z.any().optional(),
  });

type PageFormData = z.infer<ReturnType<typeof createPageSchema>>;

interface MainPageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  pageId?: string;
}

export function MainPageDialog({
  open,
  onClose,
  onSuccess,
  pageId,
}: MainPageDialogProps) {
  const isRtl = useIsRtl();
  const t = useTranslations();
  const isEditMode = !!pageId;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch page data when editing
  const { data: pageData, isLoading: isFetching } = useQuery({
    queryKey: ["page-main", pageId],
    queryFn: () => apiClient.get(`/ecommerce/dashboard/pages/main/${pageId}`),
    enabled: isEditMode && open,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PageFormData>({
    resolver: zodResolver(createPageSchema(t)),
    defaultValues: {
      name: "",
      type: "الرئيسية",
      link: "",
    },
  });

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(firstError.message as string);
      }
    }
  }, [errors]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        type: "الرئيسية",
        link: "",
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [open, reset]);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && pageData?.data?.payload && open) {
      const page = pageData.data.payload;
      reset({
        name: page.name || "",
        type: page.type || "الرئيسية",
        link: page.link || "",
      });
      if (page.image) {
        setImagePreview(page.image);
      }
    }
  }, [isEditMode, pageData, open, reset]);

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      if (data.link) {
        formData.append("link", data.link);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditMode && pageId) {
        await apiClient.put(
          `/ecommerce/dashboard/pages/main/${pageId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await apiClient.post("/ecommerce/dashboard/pages/main", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(
        isEditMode ? "تم تحديث الصفحة بنجاح" : "تم إنشاء الصفحة بنجاح"
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} page:`,
        error
      );

      if (error?.response?.status === 422) {
        const validationErrors = error?.response?.data?.errors;
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          toast.error(firstErrorMessage);
          return;
        }
      }

      toast.error(isEditMode ? "فشل تحديث الصفحة" : "فشل إنشاء الصفحة");
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`max-w-4xl w-full bg-sidebar border-white ${
          isRtl ? "rtl" : "ltr"
        }`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {isEditMode ? "تعديل لافتة" : "اضافة لافتة جديدة"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Image Upload - Left Side */}
            <div className="col-span-1">
              <ImageUpload
                label="صورة صفحة الرئيسية"
                maxSize="3MB - الحجم الأقصى"
                dimensions="2160 × 2160"
                onChange={handleImageChange}
                initialValue={imagePreview}
                minHeight="180px"
              />
            </div>

            {/* Right Side - Type and Link */}
            <div className="col-span-1 space-y-4">
              {/* Type Selection */}
              <div>
                <FormLabel required className="text-xs ">
                  نوع اللافتة
                </FormLabel>
                <Select
                  value={watch("type")}
                  onValueChange={(value) => setValue("type", value)}
                  disabled={isSubmitting || isFetching}
                >
                  <SelectTrigger className="mt-1 bg-sidebar  text-white h-12">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الرئيسية">الرئيسية</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Link Input */}
              <div>
                <FormLabel className="text-xs ">رابط اللافتة</FormLabel>
                <Textarea
                  {...register("link")}
                  disabled={isSubmitting || isFetching}
                  placeholder="رابط اللافتة"
                  className="mt-1 bg-sidebar  text-white min-h-[80px]"
                />
                {errors.link && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.link.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || isFetching}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
          >
            {(isSubmitting || isFetching) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            حفظ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
