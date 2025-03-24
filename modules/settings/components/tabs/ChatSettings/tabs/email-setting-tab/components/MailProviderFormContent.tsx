"use client";
import { generateFields } from "../../../utils/generate-fields";
import { useMailProviderCxt } from "../context/MailProviderCxt";
import FormContent from "./FormContent";

export default function MailProviderFormContent() {
  const { activeMailProvider } = useMailProviderCxt();
  const fields = generateFields(
    Object.keys(activeMailProvider?.config ?? {}) ?? []
  );
  console.log("breakpoint101 fields", fields);

  return (
    <>
      {/* {activeMailProvider?.config && (
        <FormContent config={activeMailProvider?.formConfig} />
      )} */}
    </>
  );
}
