"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload } from "lucide-react";

export default function ProductImageUpload() {
  return (
    <Card className="bg-sidebar p-6 text-center h-full flex flex-col justify-center items-center">
      <h3 className="text-foreground text-lg font-medium mb-4">صورة المنتج</h3>
      <div className="w-32 h-32 bg-gray-500 rounded-lg flex flex-col items-center justify-center mb-4">
        <Upload className="w-10 h-10 text-gray-400" />
      </div>
      <p className="text-xs text-gray-500 mb-4">
        اقصى حجم للصورة: 2160 × 2160 - 3MB
        <br />
        .jpg, .png, .webp
      </p>
      <Button variant="outline">ارفق</Button>
    </Card>
  );
}
