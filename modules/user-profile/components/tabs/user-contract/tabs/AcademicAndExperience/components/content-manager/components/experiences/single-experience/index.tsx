import { useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import SingleExperienceEditMode from "./SingleExperienceEditMode";
import SingleExperiencePreviewMode from "./SingleExperiencePreviewMode";
import { Experience } from "@/modules/user-profile/types/experience";

type PropsT = { experience: Experience };

export default function SingleExperience({ experience }: PropsT) {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title={experience?.job_name ?? ""}
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <SingleExperiencePreviewMode experience={experience} />
      ) : (
        <SingleExperienceEditMode experience={experience} />
      )}
    </FormFieldSet>
  );
}
