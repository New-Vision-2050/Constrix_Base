"use client";
import { useMailProviderCxt } from "../context/MailProviderCxt";
import FormContent from "./FormContent";

export default function MailProviderFormContent() {
  const { activeMailProvider } = useMailProviderCxt();
  return (
    <>
      {activeMailProvider?.formConfig && (
        <FormContent config={activeMailProvider?.formConfig} />
      )}
    </>
  );
}
