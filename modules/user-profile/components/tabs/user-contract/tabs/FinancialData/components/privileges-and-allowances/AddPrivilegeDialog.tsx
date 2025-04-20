import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetStateAction } from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PrivilegeItemFormConfig } from "./components/privilege-item/PrivilegeItemFormConfig";

type PropsT = {
  open: boolean;
  privilegeId: string;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function AddPrivilegeDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, privilegeId, setOpen } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            اضافة بدل جديد
          </DialogTitle>
        </DialogHeader>
        <FormContent
          config={PrivilegeItemFormConfig({
            privilegeId,
            onSuccess: () => {
              setOpen(false);
            },
          })}
        />
      </DialogContent>
    </Dialog>
  );
}
