import { useEffect, useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import MainUserConnectionInfoSectionPreview from "./preview-mode/MainUserConnectionInfoSectionPreview";
import MainUserConnectionInfoSectionEdit from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";

export default function MainUserConnectionInfoSection() {
  // declare and define component state and vars
  const { handleRefetchUserContactData } = useConnectionDataCxt();
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // handle side effects
  useEffect(() => {
    if (mode === "Preview") handleRefetchUserContactData();
  }, [mode]);
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
        <MainUserConnectionInfoSectionPreview />
      ) : (
        <MainUserConnectionInfoSectionEdit />
      )}
    </FormFieldSet>
  );
}
