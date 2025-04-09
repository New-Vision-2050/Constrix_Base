import { useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserProfilePassportDataReview from "./preview-mode";
import UserProfilePassportDataEditForm from "./edit-mode";

export default function PassportDataSectionPersonalForm() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="البيانات الهوية"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserProfilePassportDataReview />
      ) : (
        <UserProfilePassportDataEditForm />
      )}
    </FormFieldSet>
  );
}
