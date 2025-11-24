"use client";

import { Control } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ColorRow from "../color-row";
import {
  getPrimaryColors,
  getSecondaryColors,
  getInfoColors,
  getWarningColors,
  getErrorColors,
  getTextColors,
  getBackgroundColors,
  getCommonColors,
} from "../../constants";
import { ThemeSettingFormData } from "../../schema";

/**
 * ColorPaletteSection component
 * Displays all color palette configurations in an accordion
 * 
 * @param control - React Hook Form control object
 * @param title - Section title
 * @param t - Translation function for color labels
 */
interface ColorPaletteSectionProps {
  control: Control<ThemeSettingFormData>;
  title: string;
  t: (key: string) => string;
}

export default function ColorPaletteSection({
  control,
  title,
  t,
}: ColorPaletteSectionProps) {
  return (
    <Accordion type="single" collapsible defaultValue="color-palette">
      <AccordionItem value="color-palette">
        <AccordionTrigger>
          <h2 className="text-lg font-semibold">{title}</h2>
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-6 space-y-6">
            {/* common colors */}
            <ColorRow
              control={control}
              colors={getCommonColors(t)}
              columns={4}
              title={t('common')}
            />
            {/* Primary Colors */}
            <ColorRow
              control={control}
              colors={getPrimaryColors(t)}
              columns={4}
              title={t('primaryColor')}
            />

            {/* Secondary Colors */}
            <ColorRow
              control={control}
              colors={getSecondaryColors(t)}
              columns={4}
              title={t('secondaryColor')}
            />

            {/* Info Colors */}
            <ColorRow
              control={control}
              colors={getInfoColors(t)}
              columns={4}
              title={t('infoColor')}
            />

            {/* Warning Colors */}
            <ColorRow
              control={control}
              colors={getWarningColors(t)}
              columns={4}
              title={t('warningColor')}
            />

            {/* Error Colors */}
            <ColorRow
              control={control}
              colors={getErrorColors(t)}
              columns={4}
              title={t('errorColor')}
            />

            {/* Text Colors */}
            <ColorRow
              control={control}
              colors={getTextColors(t)}
              columns={4}
              title={t('textColor')}
            />

            {/* background color */}
            <ColorRow
              control={control}
              colors={getBackgroundColors(t)}
              columns={4}
              title={t('background')}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

