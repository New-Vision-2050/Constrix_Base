"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/modules/table/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
} from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";

interface ProductVideoUrlProps {
  form: UseFormReturn<any>;
}

export default function ProductVideoUrl({ form }: ProductVideoUrlProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>فيديو المنتج</FormLabel>
            <FormControl>
              <Input {...field} type="url" placeholder="example@youtube.com" />
            </FormControl>
            <FormErrorMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
