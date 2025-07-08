import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SetStateAction } from "react";
import { MaritalStatusRelativesFormConfig } from "./relative/edit-mode/marital-status-relatives-form-config";
import { useTranslations } from "next-intl";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function CreateRelativeDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, setOpen } = props;
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{t("addNewRelative")}</DialogTitle>
        </DialogHeader>
        <FormContent
          config={MaritalStatusRelativesFormConfig({
            onSuccess: () => {
              setOpen(false);
            },
          })}
        />
      </DialogContent>
    </Dialog>
  );
}
