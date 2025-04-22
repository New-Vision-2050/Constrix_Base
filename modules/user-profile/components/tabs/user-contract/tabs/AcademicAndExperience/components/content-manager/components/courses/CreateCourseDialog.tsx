import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SetStateAction } from "react";
import { SingleCourseFormConfig } from "./single-course/SingleCourseFormConfig";
import { useTranslations } from "next-intl";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function CreateCourseDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, setOpen } = props;
  const t = useTranslations("AcademicExperience");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{t("AddNewCourse")}</DialogTitle>
        </DialogHeader>
        <FormContent
          config={SingleCourseFormConfig({
            onSuccess: () => {
              setOpen(false);
            },
          })}
        />
      </DialogContent>
    </Dialog>
  );
}
