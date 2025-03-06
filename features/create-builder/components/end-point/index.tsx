"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SheetViewsManager from "../sheet-views-manager";
import CreateBuilderSheetHeader from "../sheet-header";
import { useCreateBuilderStore } from "../../store/useCreateBuilderStore";

export default function CreateBuilderViewsEndPoint() {
  const { btnLabel, originalModuleId, setModuleId } = useCreateBuilderStore();

  const handleToggleSheet = () => {
    if (!Boolean(originalModuleId)) {
      // remove selected module if use not-selected specific module case
      setModuleId("");
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
