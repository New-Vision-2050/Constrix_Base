"use client";

import ReactFlowDiagram from "./ReactFlowDiagram";
import VerticalBtnsList from "@/components/shared/VerticalList";
import { CompanyStructureBranch } from "../../company-structure/constants/BranchiesVerticalBtnsList";

export default function CompanyStructureEntryPoint() {
  return (
    <div className="flex flex-col gap-7">
      <>Tab Header</>
      <div className="flex gap-8">
        <VerticalBtnsList items={CompanyStructureBranch} />
        <div className="p-4 flex-grow gap-8">
          <ReactFlowDiagram />
        </div>
      </div>
    </div>
  );
}
