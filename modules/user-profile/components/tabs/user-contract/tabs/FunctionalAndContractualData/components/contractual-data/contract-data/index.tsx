import { useEffect, useState } from "react";
import FormFieldSet from "../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../components/FieldSetSecondTitle";
import ContractDataFormPreviewMode from "./ContractDataFormPreviewMode";
import ContractDataFormEditMode from "./ContractDataFormEditMode";
import { useFunctionalContractualCxt } from "../../../context";

export default function ContractDataForm() {
  // declare and define component state and vars
  const { userContractData } = useFunctionalContractualCxt();
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // handle side effects
  useEffect(() => {
    //   if (mode === "Preview") handleRefreshIdentityData();
  }, [mode]);

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title="عقد العمل"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <ContractDataFormPreviewMode contract={userContractData} />
      ) : (
        <ContractDataFormEditMode contract={userContractData} />
      )}
    </FormFieldSet>
  );
}
