import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetStateAction, useState, useRef } from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PrivilegeItemFormConfig } from "./components/privilege-item/PrivilegeItemFormConfig";
import FamilyMembersDialog, {
  FamilyMember,
} from "./components/privilege-item/FamilyMembersDialog";

type PropsT = {
  open: boolean;
  privilegeId: string;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function AddPrivilegeDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, privilegeId, setOpen } = props;
  const [familyDialogOpen, setFamilyDialogOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const familyMembersRef = useRef(familyMembers);
  familyMembersRef.current = familyMembers;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">اضافة بدل جديد</DialogTitle>
        </DialogHeader>
        <FormContent
          config={PrivilegeItemFormConfig({
            privilegeId,
            familyMembers,
            familyMembersRef,
            onOpenFamilyDialog: () => setFamilyDialogOpen(true),
            onSuccess: () => {
              setOpen(false);
            },
          })}
        />
      </DialogContent>

      <FamilyMembersDialog
        open={familyDialogOpen}
        onOpenChange={setFamilyDialogOpen}
        familyMembers={familyMembers}
        onFamilyMembersChange={setFamilyMembers}
      />
    </Dialog>
  );
}
