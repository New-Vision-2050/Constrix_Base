import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { SetStateAction } from "react";
import { QualificationFormConfig } from "./edit-mode/qualification-config";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function CreateQualificationDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, setOpen } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            اضافة مؤهل جديد
          </DialogTitle>
        </DialogHeader>
        <FormContent
          config={QualificationFormConfig({
            onSuccess: () => {
              setOpen(false);
            },
          })}
        />
      </DialogContent>
    </Dialog>
  );
}
