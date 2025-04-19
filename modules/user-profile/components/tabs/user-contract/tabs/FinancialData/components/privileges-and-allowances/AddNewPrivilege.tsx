import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import { useState } from "react";
import AddPrivilegeDialog from "./AddPrivilegeDialog";

export function AddNewPrivilege() {
  const { privileges } = useFinancialDataCxt();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [privilegeId, setPrivilegeId] = useState("");

  const handleClick = (id: string) => {
    setPrivilegeId(id);
    setOpen(true);
    setMenuOpen(false); // Close dropdown manually
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button>اضافة امتياز</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto">
          <DropdownMenuGroup>
            {privileges?.map((item) => (
              <DropdownMenuItem
                className="justify-end"
                key={item.id}
                onClick={() => handleClick(item.id)}
              >
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <AddPrivilegeDialog
          open={open}
          setOpen={setOpen}
          privilegeId={privilegeId}
        />
      )}
    </>
  );
}
