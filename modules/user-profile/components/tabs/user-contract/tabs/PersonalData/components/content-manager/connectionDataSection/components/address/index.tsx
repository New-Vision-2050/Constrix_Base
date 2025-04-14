import { useEffect, useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserAddressSectionPreviewMode from "./preview-mode";
import UserAddressSectionEditMode from "./edit-mode";
import { useConnectionDataCxt } from "../../context/ConnectionDataCxt";

export default function UserAddressSection() {
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
      title="العنوان"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <UserAddressSectionPreviewMode />
      ) : (
        <UserAddressSectionEditMode />
      )}
    </FormFieldSet>
  );
}
