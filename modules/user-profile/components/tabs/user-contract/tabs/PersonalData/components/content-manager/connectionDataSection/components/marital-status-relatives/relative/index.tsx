import { useState } from "react";
import FormFieldSet from "../../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../../components/FieldSetSecondTitle";
import MaritalStatusRelativesSectionPreviewMode from "./preview-mode";
import MaritalStatusRelativesSectionEditMode from "./edit-mode";
import { Relative } from "@/modules/user-profile/types/relative";

type PropsT = {
  relative: Relative;
};
export default function RelativeData({ relative }: PropsT) {
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
        <MaritalStatusRelativesSectionPreviewMode relative={relative} />
      ) : (
        <MaritalStatusRelativesSectionEditMode relative={relative} />
      )}
    </FormFieldSet>
  );
}
