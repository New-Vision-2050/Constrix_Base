import { useState } from "react";
import FormFieldSet from "../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../components/FieldSetSecondTitle";
import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";
import { Qualification } from "@/modules/user-profile/types/qualification";

type PropsT = { qualification: Qualification };
export default function SingleQualificationData({ qualification }: PropsT) {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title={""}
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <SingleQualificationDataPreview qualification={qualification} />
      ) : (
        <SingleQualificationDataEditMode qualification={qualification} />
      )}
    </FormFieldSet>
  );
}
