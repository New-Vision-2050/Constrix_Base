"use client";

import FieldSetSecondTitle from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import React, { useState } from "react";
import InfoIcon from "@/public/icons/InfoIcon";
import SupportData from "./support-data";
import OfficialDataSection from "./official-data-section";
import LegalDataSection from "./legal-data-section";
import NationalAddress from "./national-address";
import OfficialDocsSection from "./official-docs-section";

const OfficialData = () => {
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

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
