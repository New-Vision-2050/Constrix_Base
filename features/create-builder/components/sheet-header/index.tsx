import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCreateBuilderCxt } from "../../context/create-builder-cxt";

export default function CreateBuilderSheetHeader() {
  const { selectedModule } = useCreateBuilderCxt();

  const title = Boolean(selectedModule)
    ? selectedModule?.title
    : "Choose Module";

  return (
    <SheetHeader>
      <SheetTitle className=" text-center">{title}</SheetTitle>
    </SheetHeader>
  );
}
