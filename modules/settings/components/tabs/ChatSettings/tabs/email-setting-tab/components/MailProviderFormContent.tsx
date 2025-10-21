"use client";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { MailProviderConfig } from "../config/GmailFormConfig";
import { useMailProviderCxt } from "../context/MailProviderCxt";
import FormContent from "./FormContent";
import Can from "@/lib/permissions/client/Can";

export default function MailProviderFormContent() {
  const { activeMailProvider } = useMailProviderCxt();

  return (
    <Can check={[PERMISSIONS.driver.update]}>
      {activeMailProvider?.config && (
        <FormContent config={MailProviderConfig(activeMailProvider.id)} />
      )}
    </Can>
  );
}
