"use client";

import { Control, FieldValues, FieldPath } from "react-hook-form";
import { ColorItem } from "../color-item";

/**
 * Color configuration item type
 * Defines the structure for each color field
 */
export interface ColorConfig<TFieldValues extends FieldValues = any> {
  name: FieldPath<TFieldValues>;
  label: string;
}

/**
 * ColorRow component props
 * Renders multiple ColorItem components in a grid layout
 */
interface ColorRowProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  colors: ColorConfig<TFieldValues>[];
  columns?: 1 | 2 | 3 | 4;
}

/**
 * ColorRow component
 * Displays a row of color items in a responsive grid
 * Avoids code repetition by mapping over color configuration array
 * 
 * @param control - React Hook Form control object
 * @param colors - Array of color configurations (name & label)
 * @param columns - Number of columns in grid (default: 4)
 */
export default function ColorRow<TFieldValues extends FieldValues>({
  control,
  colors,
  columns = 4,
}: ColorRowProps<TFieldValues>) {
  const gridColsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${gridColsClass} gap-4 bg-sidebar rounded-lg p-6  border border-border`}>
      {colors.map((color) => (
        <ColorItem
          key={color.name as string}
          control={control}
          name={color.name}
          label={color.label}
        />
      ))}
    </div>
  );
}

