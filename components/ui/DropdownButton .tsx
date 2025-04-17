"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface DropdownButtonProps {
  options: {
    label: string;
    onClick: () => void;
  }[];
  buttonLabel?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function DropdownButton({
  options,
  buttonLabel = "إضافة",
  variant = "default",
  size = "default",
}: DropdownButtonProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            buttonVariants({ variant, size }),
            "flex gap-1 items-center"
          )}
        >
          {buttonLabel}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="z-50 min-w-[8rem] rounded-md bg-background p-1 shadow-md border text-right"
        side="bottom"
        align="start"
      >
        {options.map((opt, index) => (
          <DropdownMenu.Item
            key={index}
            className="cursor-pointer select-none rounded-sm px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            onSelect={opt.onClick}
          >
            {opt.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
