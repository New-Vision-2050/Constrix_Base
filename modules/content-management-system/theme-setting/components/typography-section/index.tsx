"use client";

import { Control } from "react-hook-form";
import { FormField, FormItem, FormControl } from "@/modules/table/components/ui/form";
import FormLabel from "@/components/shared/FormLabel";
import FormErrorMessage from "@/components/shared/FormErrorMessage";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeSettingFormData } from "../../schema";

/**
 * TypographySection component
 * Displays typography settings in an accordion
 * 
 * @param control - React Hook Form control object
 * @param title - Section title
 * @param isSubmitting - Form submission state
 * @param t - Translation function
 */
interface TypographySectionProps {
    control: Control<ThemeSettingFormData>;
    title: string;
    isSubmitting?: boolean;
    t: (key: string) => string;
}

export default function TypographySection({
    control,
    title,
    isSubmitting = false,
    t,
}: TypographySectionProps) {
    return (
        <Accordion type="single" collapsible defaultValue="typography">
            <AccordionItem value="typography">
                <AccordionTrigger>
                    <h2 className="text-lg font-semibold">{title}</h2>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* HTML Font Size */}
                            <FormField
                                control={control}
                                name="typography.htmlFontSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("htmlFontSize")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder="16"
                                                min={10}
                                                max={24}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 16);
                                                }}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Font Family - Full Width */}
                            <FormField
                                control={control}
                                name="typography.fontFamily"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("fontFamily")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder='"Roboto", "Helvetica", "Arial", sans-serif'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Font Size */}
                            <FormField
                                control={control}
                                name="typography.fontSize"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("fontSize")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder="14"
                                                min={10}
                                                max={24}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 14);
                                                }}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                            
                            {/* Font Weight Light */}
                            <FormField
                                control={control}
                                name="typography.fontWeightLight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("fontWeightLight")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder="300"
                                                min={100}
                                                max={900}
                                                step={100}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 300);
                                                }}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Font Weight Regular */}
                            <FormField
                                control={control}
                                name="typography.fontWeightRegular"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("fontWeightRegular")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder="400"
                                                min={100}
                                                max={900}
                                                step={100}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 400);
                                                }}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Font Weight Medium */}
                            <FormField
                                control={control}
                                name="typography.fontWeightMedium"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("fontWeightMedium")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder="500"
                                                min={100}
                                                max={900}
                                                step={100}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 500);
                                                }}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Font Weight Bold */}
                            <FormField
                                control={control}
                                name="typography.fontWeightBold"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">
                                            {t("fontWeightBold")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                variant="secondary"
                                                disabled={isSubmitting}
                                                className="mt-1"
                                                placeholder="700"
                                                min={100}
                                                max={900}
                                                step={100}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    field.onChange(e.target.valueAsNumber || 700);
                                                }}
                                            />
                                        </FormControl>
                                        <FormErrorMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

