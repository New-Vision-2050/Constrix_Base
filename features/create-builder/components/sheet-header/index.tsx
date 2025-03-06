import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCreateBuilderStore } from "../../store/useCreateBuilderStore";

export default function CreateBuilderSheetHeader() {
  const { selectedModule } = useCreateBuilderStore();

  const title = Boolean(selectedModule)
    ? selectedModule?.title
    : "Choose Module";

  console.log("selectedModuleselectedModule", selectedModule);

  return (
    <SheetHeader>
      <SheetTitle className=" text-center">{title}</SheetTitle>
    </SheetHeader>
  );
}
