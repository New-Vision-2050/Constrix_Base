"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/modules/table/components/ui/form";
import { Loader2 } from "lucide-react";
import FormLabel from "@/components/shared/FormLabel";
import { toast } from "sonner";
import { z } from "zod";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Types
export interface SectionFormData {
  sectionCode: string;
  sectionDescription: string;
}

export interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sectionId?: string;
}

// Mock section data
const mockSections = [
  {
    id: "sec1",
    sectionCode: 100,
    sectionDescription: "قسم الكهرباء الرئيسي",
  },
  {
    id: "sec2",
    sectionCode: 101,
    sectionDescription: "قسم الصيانة",
  },
  {
    id: "sec3",
    sectionCode: 102,
    sectionDescription: "قسم التركيب",
  },
  {
    id: "sec4",
    sectionCode: 103,
    sectionDescription: "قسم الفحص والجودة",
  },
];

// Form schema
const createSectionFormSchema = (t: any) => {
  return z.object({
    sectionCode: z
      .string()
      .min(1, t("sectionCodeRequired"))
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        t("sectionCodeRequired"),
      ),
    sectionDescription: z.string().min(1, t("sectionDescriptionRequired")),
  });
};

const getDefaultSectionFormValues = (): SectionFormData => ({
  sectionCode: "",
  sectionDescription: "",
});

export default function EditSectionDialog({
  open,
  onClose,
  onSuccess,
  sectionId,
}: SectionDialogProps) {
  const t = useTranslations("section");
  const tForm = useTranslations("section.form");
  const isEditMode = !!sectionId;

  // Mock fetch section data when editing (replace with actual API call)
  const { data: sectionData, isLoading: isFetching } = useQuery({
    queryKey: ["section", sectionId],
    queryFn: async () => {
      if (!sectionId) return null;

      // Find section from mock data
      const section = mockSections.find((s) => s.id === sectionId);

      return {
        payload: section || {
          sectionCode: 0,
          sectionDescription: "",
        },
      };
    },
    enabled: isEditMode && open && !!sectionId,
  });

  const form = useForm({
    resolver: zodResolver(createSectionFormSchema(tForm)),
    defaultValues: getDefaultSectionFormValues(),
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  // Show toast for validation errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      if (firstError?.message) {
        toast.error(tForm("validationError"));
      }
    }
  }, [errors]);

  // Reset form to default values when opening Add dialog
  useEffect(() => {
    if (open && !isEditMode) {
      reset(getDefaultSectionFormValues());
    }
  }, [open, isEditMode, reset]);

  // Populate form with section data when editing
  useEffect(() => {
    if (isEditMode && sectionData?.payload) {
      const section = sectionData.payload;
      reset({
        sectionCode: section.sectionCode?.toString() || "",
        sectionDescription: section.sectionDescription || "",
      });
    }
  }, [isEditMode, sectionData, open, reset]);

  const onSubmit = async (data: SectionFormData) => {
    try {
      // Convert string numbers to actual numbers for API
      const apiData = {
        ...data,
        sectionCode: parseInt(data.sectionCode) || 0,
      };

      // Replace with actual API calls
      if (isEditMode && sectionId) {
        // await SectionApi.update(sectionId, apiData);
        console.log("Updating section:", apiData);
      } else {
        // await SectionApi.create(apiData);
        console.log("Creating section:", apiData);
      }

      toast.success(
        isEditMode ? tForm("updateSuccess") : tForm("createSuccess"),
      );
      onSuccess?.();
      reset();
      onClose();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} section:`,
        error,
      );
      toast.error(isEditMode ? tForm("updateError") : tForm("createError"));
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isFetching) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      maxWidth={"sm"}
      PaperProps={{
        sx: {
          color: "white",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          p: 8,
        },
      }}
    >
      <DialogContent className="w-full bg-sidebar">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            {t("editSection")}
          </DialogTitle>
        </DialogHeader>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Section Code and Description - 2 Column Grid */}
            <div className="flex flex-col gap-4">
              <FormField
                control={control}
                name="sectionCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {tForm("sectionCode")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1 bg-sidebar border-gray-700"
                        placeholder={tForm("sectionCodePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="sectionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs" required>
                      {tForm("sectionDescription")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        variant="secondary"
                        disabled={isSubmitting || isFetching}
                        className="mt-1 bg-sidebar border-gray-700"
                        placeholder={tForm("sectionDescriptionPlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || isFetching}
                className="w-full"
              >
                {(isSubmitting || isFetching) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {tForm("save")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
