import { useState } from "react";
import FormFieldSet from "../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../components/FieldSetSecondTitle";
import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";

type PropsT = { title: string };
export default function SingleQualificationData({ title }: PropsT) {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title={title}
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <SingleQualificationDataPreview />
      ) : (
        <SingleQualificationDataEditMode />
      )}
    </FormFieldSet>
  );
}
