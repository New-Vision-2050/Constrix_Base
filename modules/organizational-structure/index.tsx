import OrganizationalStructureEntryPoint from "./components/entry-point";
import { OrgStructureCxtProvider } from "./context/OrgStructureCxt";

export default function OrganizationalStructureMainView() {
  return (
    <OrgStructureCxtProvider>
      <OrganizationalStructureEntryPoint />
    </OrgStructureCxtProvider>
  );
}
