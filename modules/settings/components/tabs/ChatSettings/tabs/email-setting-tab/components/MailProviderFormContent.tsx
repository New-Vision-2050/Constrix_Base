"use client";
import { MailProviderConfig } from "../config/GmailFormConfig";
import { useMailProviderCxt } from "../context/MailProviderCxt";
import FormContent from "./FormContent";

export default function MailProviderFormContent() {
  const { activeMailProvider } = useMailProviderCxt();

  return (
    <>
      {activeMailProvider?.config && (
        <FormContent config={MailProviderConfig(activeMailProvider.id)} />
      )}
    </>
  );
}
