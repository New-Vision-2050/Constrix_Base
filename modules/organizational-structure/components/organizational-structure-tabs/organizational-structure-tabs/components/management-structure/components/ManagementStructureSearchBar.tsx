import { DropdownButton } from "@/components/shared/dropdown-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchBarActions } from "../constants/SearchBarActions";
import { ArrowRightFromLine } from "lucide-react";

export default function ManagementStructureSearchBar() {
  return (
    <div className="flex items-center gap-6 justify-between w-full bg-sidebar p-4">
      <Input
        type="text"
        label=""
        placeholder="بحث"
        containerClassName="flex-grow"
        className="h-11 bg-sidebar p-4 border-2 border-slate-400 rounded-sm w-full"
      />
      <div className="flex items-center gap-2">
        {SearchBarActions?.map((action, index) => (
          <DropdownButton
            key={index}
            triggerButton={action.triggerButton}
            items={action.actions}
          />
        ))}
        <Button variant={"outline"}>
          <span>تصدير</span>
          <ArrowRightFromLine />
        </Button>
      </div>
    </div>
  );
}
