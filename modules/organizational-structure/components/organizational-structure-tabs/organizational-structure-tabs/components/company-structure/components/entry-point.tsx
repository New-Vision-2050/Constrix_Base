"use client";
import VerticalBtnsList from "@/components/shared/VerticalList";
import TabContentHeader from "@/modules/organizational-structure/components/TabContentHeader";
import ReactFlowDiagram from "./ReactFlowDiagram";
import { CompanyStructureBranch } from "../constants/BranchiesVerticalBtnsList";

export default function CompanyStructureEntryPoint() {
  return (
    <div className="flex flex-col gap-7">
      <TabContentHeader title="بنية الشركة" />
      <div className="flex gap-8">
        <VerticalBtnsList items={CompanyStructureBranch} />
        <div className="p-4 flex-grow gap-8">
          <ReactFlowDiagram />
        </div>
      </div>
    </div>
  );
}
