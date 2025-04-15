import { useState } from "react";
import FormFieldSet from "../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../components/FieldSetSecondTitle";
import ProfileBriefSummaryEdit from "./ProfileBriefSummaryEdit";
import ProfileBriefSummaryPreview from "./ProfileBriefSummaryPreview";

export default function ProfileBriefSummary() {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title={"نبذه مختصرة"}
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <ProfileBriefSummaryPreview />
      ) : (
        <ProfileBriefSummaryEdit />
      )}
    </FormFieldSet>
  );
}
