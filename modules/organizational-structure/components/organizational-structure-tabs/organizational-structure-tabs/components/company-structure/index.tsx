import VerticalBtnsList from "@/components/shared/VerticalList";
import TabContentHeader from "@/modules/organizational-structure/components/TabContentHeader";
import ReactFlowDiagram from "./components/ReactFlowDiagram";
import { CompanyStructureCxtProvider } from "./context";

export default function CompanyStructureTab() {
  return (
    <CompanyStructureCxtProvider>
      <div className="flex flex-col gap-7">
        <TabContentHeader />
        <div className="flex gap-8">
          <VerticalBtnsList items={[]} />
          <div className="p-4 flex-grow gap-8 bg-sidebar">
            <ReactFlowDiagram />
          </div>
        </div>
      </div>
    </CompanyStructureCxtProvider>
  );
}
