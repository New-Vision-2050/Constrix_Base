"use client";
import { SMSProviderConfig } from "../config/SmsFormConfig";
import { useSmsProviderCxt } from "../context/SmsProviderCxt";
import FormContent from "./FormContent";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function SmsProviderFormContent() {
  const { activeSmsProvider } = useSmsProviderCxt();

  return (
    <Can check={[PERMISSIONS.driver.update]}>
      {activeSmsProvider?.config && (
        <FormContent config={SMSProviderConfig(activeSmsProvider.id)} />
      )}
    </Can>
  );
}
