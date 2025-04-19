"use client";

import SupportData from "./support-data";
import OfficialDataSection from "./official-data-section";
import LegalDataSection from "./legal-data-section";
import NationalAddress from "./national-address";
import OfficialDocsSection from "./official-docs-section";

const OfficialData = () => {
  return (
    <div className="bg-sidebar p-5 rounded-md space-y-5">
      <OfficialDataSection />

      <LegalDataSection />

      <SupportData />

      <NationalAddress />

      <OfficialDocsSection />
    </div>
  );
};

export default OfficialData;
