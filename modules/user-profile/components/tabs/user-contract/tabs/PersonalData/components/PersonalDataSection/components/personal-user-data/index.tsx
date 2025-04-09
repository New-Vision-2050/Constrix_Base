import { useState } from "react";
import UserProfilePersonalDataEditForm from "./edit-mode";
import FormFieldSet from "../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../FieldSetSecondTitle";
import UserProfilePersonalDataReview from "./preview-mode";

export default function PersonalDataSectionPersonalForm() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="البيانات الشخصية"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserProfilePersonalDataReview />
      ) : (
        <UserProfilePersonalDataEditForm />
      )}
    </FormFieldSet>
  );
}
