"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SheetViewsManager from "../sheet-views-manager";
import CreateBuilderSheetHeader from "../sheet-header";
import { useCreateBuilderCxt } from "../../context/create-builder-cxt";
import { SetStateAction } from "react";

type PropsT = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
};
export default function CreateBuilderViewsEndPoint(props: PropsT) {
  const { isOpen, setIsOpen } = props;
  const { btnLabel, originalModuleId, handleChangeModuleId } =
    useCreateBuilderCxt();

  const handleToggleSheet = (open: boolean) => {
    if (!Boolean(originalModuleId)) {
      // remove selected module if use not-selected specific module case
      handleChangeModuleId("");
    }
    setIsOpen(open);
  };

  return (
    <Sheet onOpenChange={handleToggleSheet} open={isOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px]"
          onClick={() => setIsOpen(true)}
        >
          {btnLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <CreateBuilderSheetHeader />
        <SheetViewsManager />
      </SheetContent>
    </Sheet>
  );
}
