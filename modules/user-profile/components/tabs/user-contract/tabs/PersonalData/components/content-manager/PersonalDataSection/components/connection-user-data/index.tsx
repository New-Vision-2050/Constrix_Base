import { useEffect, useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import UserProfileConnectionDataEditForm from "./edit-mode";
import UserProfileConnectionDataReview from "./preview-mode";
import { ConnectionOTPCxtProvider } from "./context/ConnectionOTPCxt";

export default function ConnectionDataSectionPersonalForm() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");


  // handle side effects
  useEffect(()=>{},[])

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <ConnectionOTPCxtProvider>
      <FormFieldSet
        title="البيانات الاتصال"
        secondTitle={
          <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
        }
      >
        {mode === "Preview" ? (
          <UserProfileConnectionDataReview />
        ) : (
          <UserProfileConnectionDataEditForm />
        )}
      </FormFieldSet>
    </ConnectionOTPCxtProvider>
  );
}
