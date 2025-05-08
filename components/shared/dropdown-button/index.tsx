"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DropdownItemT = {
  text: string;
  onClick?: () => void;
};

type PropsT = {
  items: DropdownItemT[];
  triggerButton: JSX.Element;
};

export function DropdownButton(props: PropsT) {
  const { items, triggerButton } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {items?.map((item, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => {
                item?.onClick?.();
              }}
            >
              {item.text}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
