import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DropdownItemT = {
  title: string;
  disabled?: boolean;
  onClick?: () => void;
};

type PropsT = {
  icon: JSX.Element;
  items: DropdownItemT[];
};

export function IconBtnDropdown(props: PropsT) {
  const { icon, items } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{icon}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 justify-end">
        {items?.map((item) => (
          <DropdownMenuItem
            className="justify-end"
            onClick={() => {
              item?.onClick?.();
            }}
            key={item.title}
            disabled={item.disabled} 
          >
            {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
