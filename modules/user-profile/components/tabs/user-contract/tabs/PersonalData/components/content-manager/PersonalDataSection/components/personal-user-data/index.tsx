import { useEffect, useState } from "react";
import UserProfilePersonalDataEditForm from "./edit-mode";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserProfilePersonalDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";

export default function PersonalDataSectionPersonalForm() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");
  const { handleRefreshPersonalData } = usePersonalDataTabCxt();

  // handle side effects
  useEffect(() => {
    if (mode === "Preview") handleRefreshPersonalData();
  }, [mode]);
  
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
