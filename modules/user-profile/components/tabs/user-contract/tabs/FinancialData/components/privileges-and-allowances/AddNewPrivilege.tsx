import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useFinancialDataCxt } from "../../context/financialDataCxt";

export function AddNewPrivilege() {
  const { privileges } = useFinancialDataCxt();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>اضافة امتياز</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto">
        <DropdownMenuGroup>
          {privileges &&
            privileges?.map((item) => (
              <DropdownMenuItem className="justify-end" key={item.id}>
                {item.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
