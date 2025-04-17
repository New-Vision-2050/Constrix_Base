import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PrivilegesActionsList } from "../../constants/privileges-actions-list";

export function AddNewPrivilege() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>اضافة امتياز</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuGroup>
          {PrivilegesActionsList?.map((item) => (
            <DropdownMenuItem className="justify-end"  key={item.type}>{item.title}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
