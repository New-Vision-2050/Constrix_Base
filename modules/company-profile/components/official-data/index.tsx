"use client";

import FieldSetSecondTitle from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import React, { useState } from "react";
import OfficialDataPreview from "./official-data-preview";

const OfficialData = () => {
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <div className="bg-sidebar p-5 rounded-md">
      <FormFieldSet
        title="البيانات الرسمية"
        secondTitle={
          <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
        }
      >
        {mode === "Preview" ? <OfficialDataPreview /> : <div>Edit</div>}
      </FormFieldSet>
    </div>
  );
};

export default OfficialData;
