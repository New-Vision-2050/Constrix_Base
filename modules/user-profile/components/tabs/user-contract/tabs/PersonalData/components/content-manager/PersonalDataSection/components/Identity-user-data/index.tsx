import { useEffect, useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileIdentityDataReview from "./preview-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";

export default function IdentityDataSectionPersonalForm() {
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
      title="البيانات الهوية"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserProfileIdentityDataReview />
      ) : (
        <UserProfileConnectionDataEditForm />
      )}
    </FormFieldSet>
  );
}
