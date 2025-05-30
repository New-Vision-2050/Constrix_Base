import { UsersStructureCxtProvider } from "./context";
import UsersStructureEntryPoint from "./components/entry-point";

export default function UsersStructureTab() {
  return (
    <UsersStructureCxtProvider>
      <UsersStructureEntryPoint />
    </UsersStructureCxtProvider>
  );
}
