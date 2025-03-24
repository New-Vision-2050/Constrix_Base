"use client";
import { SMSProviderConfig } from "../config/SmsFormConfig";
import { useSmsProviderCxt } from "../context/SmsProviderCxt";
import FormContent from "./FormContent";

export default function SmsProviderFormContent() {
  const { activeSmsProvider } = useSmsProviderCxt();

  return (
    <>
      {activeSmsProvider?.config && (
        <FormContent config={SMSProviderConfig(activeSmsProvider.id)} />
      )}
    </>
  );
}
