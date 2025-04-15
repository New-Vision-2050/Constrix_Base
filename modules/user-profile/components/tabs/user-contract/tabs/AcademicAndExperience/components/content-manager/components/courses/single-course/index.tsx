import { useState } from "react";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import FieldSetSecondTitle from "../../../../../../components/FieldSetSecondTitle";
import SingleCoursePreviewMode from "./SingleCoursePreviewMode";
import SingleCourseEditMode from "./SingleCourseEditMode";
import { Course } from "@/modules/user-profile/types/Course";

type PropsT = { course: Course };

export default function SingleCourse({ course }: PropsT) {
  // declare and define component state and vars
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <FormFieldSet
      title={course?.name ?? ""}
      secondTitle={
        <FieldSetSecondTitle mode={mode} handleEditClick={handleEditClick} />
      }
    >
      {mode === "Preview" ? (
        <SingleCoursePreviewMode course={course} />
      ) : (
        <SingleCourseEditMode course={course} />
      )}
    </FormFieldSet>
  );
}
