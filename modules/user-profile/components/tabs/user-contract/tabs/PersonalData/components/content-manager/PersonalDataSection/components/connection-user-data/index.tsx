import { useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataReview from "./preview-mode";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="البيانات الاتصال"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserProfileConnectionDataReview />
      ) : (
        <UserProfileConnectionDataEditForm />
      )}
    </FormFieldSet>
  );
}
