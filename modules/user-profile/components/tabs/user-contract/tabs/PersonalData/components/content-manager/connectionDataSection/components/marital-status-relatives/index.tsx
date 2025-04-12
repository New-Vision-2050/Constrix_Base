import { useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";

export default function MaritalStatusRelativesSection() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="الحالة الاجتماعية"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <MaritalStatusRelativesSectionPreviewMode />
      ) : (
        <MaritalStatusRelativesSectionEditMode />
      )}
    </FormFieldSet>
  );
}
