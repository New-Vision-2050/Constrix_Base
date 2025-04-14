import { useEffect, useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserIqamaWorkLicenseDataPreviewMode from "./preview-mode";
import UserIqamaWorkLicenseDataEditMode from "./edit-mode";
import { usePersonalDataTabCxt } from "../../../../../context/PersonalDataCxt";

export default function UserIqamaWorkLicenseData() {
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
      title="بيانات رخصة العمل"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserIqamaWorkLicenseDataPreviewMode />
      ) : (
        <UserIqamaWorkLicenseDataEditMode />
      )}
    </FormFieldSet>
  );
}
