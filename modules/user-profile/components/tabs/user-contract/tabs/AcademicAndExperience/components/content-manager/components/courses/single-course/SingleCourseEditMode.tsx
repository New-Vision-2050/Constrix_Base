import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SingleCourseFormConfig } from "./SingleCourseFormConfig";
import { Course } from "@/modules/user-profile/types/Course";

type PropsT = { course: Course };
export default function SingleCourseEditMode({ course }: PropsT) {
  return (
    <div className="flex flex-col gap-6">
      <FormContent config={SingleCourseFormConfig({course})} />
    </div>
  );
}
