import { useEffect, useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import SocialDataSectionPreviewMode from "./preview-mode";
import SocialDataSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";

export default function SocialDataSection() {
  // declare and define component state and vars
  const { handleRefetchUserSocialData } = useConnectionDataCxt();
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // handle side effects
  useEffect(() => {
    if (mode === "Preview") handleRefetchUserSocialData();
  }, [mode]);

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="حسابات التواصل الاجتماعي"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <SocialDataSectionPreviewMode />
      ) : (
        <SocialDataSectionEditMode />
      )}
    </FormFieldSet>
  );
}
