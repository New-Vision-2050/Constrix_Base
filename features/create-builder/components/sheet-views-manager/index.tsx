import { useCreateBuilderStore } from "../../store/useCreateBuilderStore";
import ChooseModule from "../choose-module";

export default function SheetViewsManager() {
  const { selectedModule } = useCreateBuilderStore();

  return Boolean(selectedModule) ? (
    <>{selectedModule?.formContent}</>
  ) : (
    <ChooseModule />
  );
}
