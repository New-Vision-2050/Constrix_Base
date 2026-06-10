import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { SetStateAction, useState, useRef, useCallback } from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PrivilegeItemFormConfig } from "./components/privilege-item/PrivilegeItemFormConfig";
import FamilyMembersDialog, {
  FamilyMember,
} from "./components/privilege-item/FamilyMembersDialog";

// Memoized form wrapper to prevent re-render when dialog state changes
const AddPrivilegeForm = React.memo(function AddPrivilegeForm({
  privilegeId,
  familyMembersRef,
  onOpenFamilyDialog,
  onSuccess,
}: {
  privilegeId: string;
  familyMembersRef: React.MutableRefObject<FamilyMember[]>;
  onOpenFamilyDialog: () => void;
  onSuccess: () => void;
}) {
  const config = PrivilegeItemFormConfig({
    privilegeId,
    familyMembersRef,
    onOpenFamilyDialog,
    onSuccess,
  });
  return <FormContent config={config} />;
});

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

  const onOpenFamilyDialog = useCallback(() => setFamilyDialogOpen(true), []);
  const onSuccess = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">اضافة بدل جديد</DialogTitle>
        </DialogHeader>
        <AddPrivilegeForm
          privilegeId={privilegeId}
          familyMembersRef={familyMembersRef}
          onOpenFamilyDialog={onOpenFamilyDialog}
          onSuccess={onSuccess}
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
