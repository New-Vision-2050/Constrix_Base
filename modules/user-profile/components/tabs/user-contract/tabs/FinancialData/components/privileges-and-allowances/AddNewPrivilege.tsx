"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useFinancialDataCxt } from "../../context/financialDataCxt";
import { useEffect, useState } from "react";
import AddPrivilegeDialog from "./AddPrivilegeDialog";
import { useTranslations } from "next-intl";
export function AddNewPrivilege() {
  const { privileges, addedPrivilegesList } = useFinancialDataCxt();
  const [addedPrivilegesTypes, setAddedPrivilegesTypes] = useState<string[]>();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [privilegeId, setPrivilegeId] = useState("");
  const t = useTranslations("UserProfile");
  // handle side effects
  useEffect(() => {
    if (addedPrivilegesList) {
      setAddedPrivilegesTypes(
        addedPrivilegesList?.map((item) => item?.privilege?.type)
      );
    }
  }, [addedPrivilegesList]);

  const handleClick = (id: string) => {
    setPrivilegeId(id);
    setOpen(true);
    setMenuOpen(false); // Close dropdown manually
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button>{t("tabs.financialData.addNewPrivilege")}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto">
          <DropdownMenuGroup>
            {privileges
              ?.filter((ele) => addedPrivilegesTypes?.indexOf(ele.type) === -1)
              ?.map((item) => (
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
