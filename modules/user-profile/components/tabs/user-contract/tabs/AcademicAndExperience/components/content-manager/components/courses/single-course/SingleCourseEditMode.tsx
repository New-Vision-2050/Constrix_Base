import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SingleCourseFormConfig } from "./SingleCourseFormConfig";

export default function SingleCourseEditMode() {
  return (
    <div className="flex flex-col gap-6">
      <FormContent config={SingleCourseFormConfig()} />
    </div>
  );
}
