import SingleCoursePreviewMode from "./SingleCoursePreviewMode";
import SingleCourseEditMode from "./SingleCourseEditMode";
import { Course } from "@/modules/user-profile/types/Course";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

type PropsT = { course: Course };

export default function SingleCourse({ course }: PropsT) {

  return (
    <TabTemplate
      title={course?.name ?? ""}
      reviewMode={<SingleCoursePreviewMode course={course} />}
      editMode={<SingleCourseEditMode course={course} />}
    />
  );
}
