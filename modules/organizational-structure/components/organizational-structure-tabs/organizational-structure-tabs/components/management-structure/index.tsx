import CompanyStructureEntryPoint from "./components/entry-point";
import { ManagementsStructureCxtProvider } from "./context";

export default function ManagementsStructure() {
  return (
    <ManagementsStructureCxtProvider>
      <CompanyStructureEntryPoint />
    </ManagementsStructureCxtProvider>
  );
}
