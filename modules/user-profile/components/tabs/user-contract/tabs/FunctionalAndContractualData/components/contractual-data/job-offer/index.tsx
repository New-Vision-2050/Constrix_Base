import { useEffect, useState } from "react";
import FormFieldSet from "../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../components/FieldSetSecondTitle";
import JobOfferFormPreviewMode from "./JobOfferPreviewMode";
import JobOfferEditMode from "./JobOfferEditMode";
import { JobOffer } from "@/modules/user-profile/types/job-offer";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferForm({ offer }: PropsT) {
  // declare and define component state and vars
  //   const { handleRefreshIdentityData } = usePersonalDataTabCxt();
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
      title="العرض الوظيفي"
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <JobOfferFormPreviewMode offer={offer} />
      ) : (
        <JobOfferEditMode offer={offer} />
      )}
    </FormFieldSet>
  );
}
