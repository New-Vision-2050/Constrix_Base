"use client";
import { can } from "@/hooks/useCan";
import { MailProviderConfig } from "../config/GmailFormConfig";
import { useMailProviderCxt } from "../context/MailProviderCxt";
import FormContent from "./FormContent";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function MailProviderFormContent() {
  const { activeMailProvider } = useMailProviderCxt();

    const canView = can(
    PERMISSION_ACTIONS.VIEW,
    PERMISSION_SUBJECTS.DRIVER
  ) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      {activeMailProvider?.config && (
        <FormContent config={MailProviderConfig(activeMailProvider.id)} />
      )}
    </CanSeeContent>
  );
}
