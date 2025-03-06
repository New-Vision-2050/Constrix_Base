import { useCreateBuilderCxt } from "../../context/create-builder-cxt";
import ChooseModule from "../choose-module";

export default function SheetViewsManager() {
  const { selectedModule } = useCreateBuilderCxt();

  return Boolean(selectedModule) ? (
    <>{selectedModule?.formContent}</>
  ) : (
    <ChooseModule />
  );
}
