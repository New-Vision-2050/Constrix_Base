"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/modules/table/components/ui/form";
import { Button } from "@/components/ui/button";
import { ColorItem } from "./components/color-item";
import {
  createThemeSettingFormSchema,
  getDefaultThemeSettingFormValues,
  ThemeSettingFormData,
} from "./schema";

/**
 * Example usage of ColorItem component
 * Demonstrates integration with React Hook Form
 */
export default function ThemeSettingExample() {
  const form = useForm<ThemeSettingFormData>({
    resolver: zodResolver(createThemeSettingFormSchema((key) => key)),
    defaultValues: getDefaultThemeSettingFormValues(),
  });

  const onSubmit = (data: ThemeSettingFormData) => {
    console.log("Theme settings:", data);
  };

  return (
    <div className="px-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-sidebar rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white">
              Theme Settings
            </h2>

            {/* Example: Primary Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorItem
                control={form.control}
                name="palette.primary.main"
                label="Primary Main Color"
              />
              <ColorItem
                control={form.control}
                name="palette.primary.light"
                label="Primary Light Color"
              />
              <ColorItem
                control={form.control}
                name="palette.primary.dark"
                label="Primary Dark Color"
              />
              <ColorItem
                control={form.control}
                name="palette.primary.contrastText"
                label="Primary Contrast Text"
              />
            </div>
          </div>

          <Button type="submit">Save Theme Settings</Button>
        </form>
      </Form>
    </div>
  );
}

