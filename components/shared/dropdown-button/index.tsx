"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export type DropdownItemT = {
  text: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type PropsT = {
  items: DropdownItemT[];
  triggerButton: JSX.Element;
};

export function DropdownButton(props: PropsT) {
  const { items, triggerButton } = props;
  
  // Get current locale for RTL support
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent 
        className={cn("w-56", isRtl ? "text-right" : "text-left")}
      >
        <DropdownMenuGroup>
          {items?.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                item?.onClick?.();
              }}
              className={cn(
                "flex items-center gap-2",
                isRtl ? "flex-row-reverse" : "flex-row"
              )}
            >
              {item.icon && (
                <span className="flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span>{item.text}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
