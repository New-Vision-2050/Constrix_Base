"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/modules/table/components/ui/form";
import { Input } from "@/modules/table/components/ui/input";
import { Textarea } from "@/modules/table/components/ui/textarea";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import FormLabel from "@/components/shared/FormLabel";
import ImageUpload from "@/components/shared/ImageUpload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/config/axios-config";

const createPageSchema = (t: (key: string) => string) =>
  z.object({
    type: z.string().optional(),
    url: z
      .string()
      .optional()
      .refine(
        (val) => !val || val === "" || /^https?:\/\/.+/.test(val),
        { message: "يجب أن يكون الرابط صحيح" }
      ),
    banner_image: z.any().optional(),
    title: z
      .string()
      .min(1, { message: t("pagesSettings.validation.titleRequired") }),
    description: z
      .string()
      .min(1, { message: t("pagesSettings.validation.descriptionRequired") }),
  });

type PageFormData = z.infer<ReturnType<typeof createPageSchema>>;

interface MainPageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  pageId?: string;
}

const DEFAULT_VALUES = { type: "home", url: "", title: "", description: "" };

export function MainPageDialog({ open, onClose, onSuccess, pageId }: MainPageDialogProps) {
  const t = useTranslations();
  const isEditMode = !!pageId;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch banner data when editing
  const { data: pageData, isLoading: isFetching } = useQuery({
    queryKey: ["banner", pageId],
    queryFn: () => apiClient.get(`/ecommerce/dashboard/banners/${pageId}`),
    enabled: isEditMode && open,
  });

  const form = useForm<PageFormData>({
    resolver: zodResolver(createPageSchema(t)),
    defaultValues: DEFAULT_VALUES,
  });

  const { handleSubmit, reset, formState: { errors, isSubmitting } } = form;

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
      reset(DEFAULT_VALUES);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [open, reset]);

  // Populate form in edit mode
  useEffect(() => {
    if (isEditMode && pageData?.data?.payload && open) {
      const { type, url, title, description, banner_image } = pageData.data.payload;
      reset({ type: type || "home", url: url || "", title: title || "", description: description || "" });
      if (banner_image) setImagePreview(banner_image);
    }
  }, [isEditMode, pageData, open, reset]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: PageFormData) => {
    try {
      const formData = new FormData();
      formData.append("type", data.type || "home");
      if (data.url) formData.append("url", data.url);
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (imageFile) formData.append("banner_image", imageFile);

      const url = isEditMode && pageId ? `/ecommerce/dashboard/banners/${pageId}` : "/ecommerce/dashboard/banners";
      await apiClient.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });

      toast.success(t(`pagesSettings.messages.${isEditMode ? "update" : "create"}Success`));
      onSuccess?.();
      reset();
      onClose();
    } catch (error: any) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} banner:`, error);
      
      const validationErrors = error?.response?.data?.errors;
      if (error?.response?.status === 422 && validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          toast.error(firstError[0] as string);
        }
        return;
      }
      
      toast.error(t(`pagesSettings.messages.${isEditMode ? "update" : "create"}Error`));
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
      <DialogContent className="max-w-4xl w-full bg-sidebar border-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold text-white">
            {t(`pagesSettings.actions.${isEditMode ? "edit" : "add"}Banner`)}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Main Grid Layout: Image Left, Inputs Right */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Side - Image Upload */}
              <div className="col-span-1">
                <ImageUpload
                  label={t("pagesSettings.fields.bannerImage")}
                  maxSize="3MB - الحجم الأقصى"
                  dimensions="2160 × 2160"
                  onChange={handleImageChange}
                  initialValue={imagePreview}
                  minHeight="180px"
                />
              </div>

              {/* Right Side - All Inputs */}
              <div className="col-span-1">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t("pagesSettings.fields.bannerTitle")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-sidebar text-white" />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("pagesSettings.fields.bannerUrl")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isSubmitting || isFetching}
                            className="bg-sidebar text-white"
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>
                          {t("pagesSettings.fields.bannerDescription")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-sidebar text-white min-h-[100px]"
                          />
                        </FormControl>
                        <FormErrorMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || isFetching}
              className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white"
            >
              {(isSubmitting || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t(`pagesSettings.actions.${isSubmitting || isFetching ? "saving" : "save"}`)}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
