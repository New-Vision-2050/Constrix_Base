"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import ImageUpload from "@/components/shared/ImageUpload";

interface ProductImageUploadProps {
  form: UseFormReturn<any>;
}

export default function ProductImageUpload({ form }: ProductImageUploadProps) {
  const handleMainImageChange = (file: File | null) => {
    form.setValue("main_photo", file);
  };

  const handleOtherImagesChange = (files: File[]) => {
    form.setValue("other_photos", files);
  };

  // Get initial values for edit mode
  const mainPhotoValue = form.watch("main_photo");
  const otherPhotosValue = form.watch("other_photos");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Main Product Image */}
        <ImageUpload
          label="صورة المنتج الرئيسية"
          maxSize="3MB - الحجم الأقصى"
          dimensions="2160 × 2160"
          required={false}
          onChange={handleMainImageChange}
          initialValue={typeof mainPhotoValue === 'string' ? mainPhotoValue : undefined}
          minHeight="200px"
        />

        {/* Additional Product Image */}
        <ImageUpload
          label="صور أخرى للمنتج"
          maxSize="3MB - الحجم الأقصى"
          dimensions="2160 × 2160"
          required={false}
          onMultipleChange={handleOtherImagesChange}
          initialValue={Array.isArray(otherPhotosValue) && otherPhotosValue.every((v: any) => typeof v === 'string') ? otherPhotosValue : undefined}
          multiple={true}
          accept="image/*"
          minHeight="200px"
        />
      </div>
    </div>
  );
}
