import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsRtl } from "@/hooks/use-is-rtl";
import { cn } from "@/lib/utils";
import { ComponentProps, ReactNode } from "react";

export interface SimpleSelectProps<T = string>
  extends Omit<
    ComponentProps<typeof Select>,
    "onValueChange" | "children" | "value"
  > {
  triggerProps?: Omit<ComponentProps<typeof SelectTrigger>, "children">;
  valueProps?: Omit<ComponentProps<typeof SelectValue>, "children">;
  contentProps?: Omit<ComponentProps<typeof SelectContent>, "children">;
  itemProps?: Omit<ComponentProps<typeof SelectItem>, "children">;
  options?: { label: ReactNode; value: T }[];
  value?: T;
  onValueChange?: (value: T) => void;
}

function SimpleSelect<T = string>({
  triggerProps,
  valueProps,
  contentProps,
  itemProps,
  options,
  value,
  onValueChange,
  ...props
}: SimpleSelectProps<T>) {
  const isRtl = useIsRtl();
  return (
    <Select
      dir={isRtl ? "rtl" : "ltr"}
      {...props}
      value={value as unknown as string}
      onValueChange={onValueChange as unknown as (value: string) => void}
    >
      <SelectTrigger
        {...triggerProps}
        className={cn("h-10", triggerProps?.className)}
      >
        <SelectValue {...valueProps} />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {options?.map((option) => (
          <SelectItem
            key={String(option.value)}
            {...itemProps}
            value={option.value as string}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SimpleSelect;
