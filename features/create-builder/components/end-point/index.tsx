"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SheetViewsManager from "../sheet-views-manager";
import CreateBuilderSheetHeader from "../sheet-header";
import { useCreateBuilderCxt } from "../../context/create-builder-cxt";

export default function CreateBuilderViewsEndPoint() {
  const { btnLabel, originalModuleId, handleChangeModuleId } =
    useCreateBuilderCxt();

  const handleToggleSheet = () => {
    if (!Boolean(originalModuleId)) {
      // remove selected module if use not-selected specific module case
      handleChangeModuleId("");
    }
  };

  return (
    <Sheet onOpenChange={handleToggleSheet}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-[200px]">
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
