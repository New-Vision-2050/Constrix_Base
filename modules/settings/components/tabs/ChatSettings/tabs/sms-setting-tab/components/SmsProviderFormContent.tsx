"use client";
import { useSmsProviderCxt } from "../context/SmsProviderCxt";
import FormContent from "./FormContent";

export default function SmsProviderFormContent() {
  const { activeSmsProvider } = useSmsProviderCxt();
  return (
    <>
      {activeSmsProvider?.formConfig && (
        <FormContent config={activeSmsProvider?.formConfig} />
      )}
    </>
  );
}
