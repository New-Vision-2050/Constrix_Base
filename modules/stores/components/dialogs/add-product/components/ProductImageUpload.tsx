"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import type { CreateProductFormData } from "../schema";

interface ProductImageUploadProps {
  form: UseFormReturn<CreateProductFormData>;
}

export default function ProductImageUpload({ form }: ProductImageUploadProps) {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    form.setValue("main_image", file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    form.setValue("main_image", null as unknown as File);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="bg-sidebar p-6 text-center h-full flex flex-col justify-center items-center">
      <h3 className="text-foreground text-lg font-medium mb-4">
        {t("product.dialog.add.fields.mainImage.label")}
      </h3>

      <FormField
        control={form.control}
        name="main_image"
        render={() => (
          <FormItem className="w-full">
            <FormControl>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                }}
                className="hidden"
              />
            </FormControl>

            {preview ? (
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                  onClick={handleRemove}
                  title={t("product.dialog.add.fields.mainImage.remove")}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-500 rounded-lg flex flex-col items-center justify-center mb-4">
                <Upload className="w-10 h-10 text-gray-400" />
              </div>
            )}

            <FormErrorMessage />
          </FormItem>
        )}
      />

      <p className="text-xs text-gray-500 mb-4">
        {t("product.dialog.add.fields.mainImage.dragText")}
        <br />
        .jpg, .png, .webp
      </p>

      {!preview && (
        <Button type="button" variant="outline" onClick={handleUpload}>
          {t("product.dialog.add.fields.mainImage.uploadText")}
        </Button>
      )}
    </Card>
  );
}
