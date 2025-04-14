import { useEffect, useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserProfilePassportDataReview from "./preview-mode";
import UserProfilePassportDataEditForm from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";

export default function PassportDataSectionPersonalForm() {
  // declare and define component state and vars
  const { handleRefreshIdentityData } = usePersonalDataTabCxt();
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // handle side effects
  useEffect(() => {
    if (mode === "Preview") handleRefreshIdentityData();
  }, [mode]);
  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="البيانات جواز السفر"
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
