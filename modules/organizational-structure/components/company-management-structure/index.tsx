"use client";

import CompanyManagementsStructureEntryPoint from "./entry-point";
import { ManagementsStructureCxtProvider } from "./ManagementsStructureCxt";

const CompanyManagementsStructure = () => {
  return (
    <ManagementsStructureCxtProvider>
      <CompanyManagementsStructureEntryPoint />
    </ManagementsStructureCxtProvider>
  );
};

export default CompanyManagementsStructure;
