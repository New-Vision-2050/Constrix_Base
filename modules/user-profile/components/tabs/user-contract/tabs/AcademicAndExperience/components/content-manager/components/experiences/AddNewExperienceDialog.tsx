import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SetStateAction } from "react";
import { SingleExperienceFormConfig } from "./single-experience/SingleExperienceFormConfig";
import { useTranslations } from "next-intl";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function AddNewExperienceDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, setOpen } = props;
  const t = useTranslations('UserProfile.nestedTabs.academicExperience');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{t('createExperience')}</DialogTitle>
        </DialogHeader>
        <FormContent
          config={SingleExperienceFormConfig({
            onSuccess: () => {
              setOpen(false);
            },
          })}
        />
      </DialogContent>
    </Dialog>
  );
}
