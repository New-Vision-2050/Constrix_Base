"use client";
import { useState, useRef } from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { PrivilegeItemFormConfig } from "./PrivilegeItemFormConfig";
import { UserPrivilege } from "@/modules/user-profile/types/privilege";
import FamilyMembersDialog, { FamilyMember } from "./FamilyMembersDialog";

type PropsT = {
  privilegeData: UserPrivilege;
};

export default function PrivilegeItemEditMode({ privilegeData }: PropsT) {
  const [familyDialogOpen, setFamilyDialogOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    // Initialize from existing subscription data
    const existingMembers = privilegeData?.subscriptions?.[0]?.family_members;
    if (existingMembers && existingMembers.length > 0) {
      return existingMembers.map((m) => ({
        id: m.id,
        name: m.name,
        national_id: m.national_id,
        relation: m.relation,
        amount: m.amount?.toString() || "0",
        subscription_no: m.subscription_no || "",
      }));
    }
    return [];
  });

  // Use ref to always have latest familyMembers in onSubmit closure
  const familyMembersRef = useRef(familyMembers);
  familyMembersRef.current = familyMembers;

  const config = PrivilegeItemFormConfig({
    privilegeData,
    familyMembers,
    familyMembersRef,
    onOpenFamilyDialog: () => setFamilyDialogOpen(true),
  });

  return (
    <div>
      <FormContent config={config} />

      <FamilyMembersDialog
        open={familyDialogOpen}
        onOpenChange={setFamilyDialogOpen}
        familyMembers={familyMembers}
        onFamilyMembersChange={setFamilyMembers}
      />
    </div>
  );
}
