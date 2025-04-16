import { useState } from "react";
import FieldSetSecondTitle from "../../../components/FieldSetSecondTitle";
import FormFieldSet from "../../../components/FormFieldSet";
// import { useFunctionalContractualCxt } from "../../context";
import JobInformationEditMode from "./JobInformationEditMode";
import JobInformationPreviewMode from "./JobInformationPreviewMode";

export default function JobInformation() {
  // const { userJobOffersData } = useFunctionalContractualCxt();
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">البيانات الوظيفية</p>
      <FormFieldSet
        title="بيانات التوظيف"
        secondTitle={
          <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
        }
      >
        {mode === "Preview" ? (
          <JobInformationPreviewMode />
        ) : (
          <JobInformationPreviewMode />
          // <JobInformationEditMode />
        )}
      </FormFieldSet>
    </div>
  );
}
