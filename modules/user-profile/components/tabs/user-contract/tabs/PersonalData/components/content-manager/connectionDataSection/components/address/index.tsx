import { useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserAddressSectionPreviewMode from "./preview-mode";
import UserAddressSectionEditMode from "./edit-mode";

export default function UserAddressSection() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="العنوان"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserAddressSectionPreviewMode />
      ) : (
        <UserAddressSectionEditMode />
      )}
    </FormFieldSet>
  );
}
