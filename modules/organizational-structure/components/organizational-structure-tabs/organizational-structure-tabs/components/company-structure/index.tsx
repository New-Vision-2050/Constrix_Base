import { CompanyStructureCxtProvider } from "./context";
import CompanyStructureEntryPoint from "./components/entry-point";

export default function CompanyStructureTab() {
  return (
    <CompanyStructureCxtProvider>
      <CompanyStructureEntryPoint />
    </CompanyStructureCxtProvider>
  );
}
