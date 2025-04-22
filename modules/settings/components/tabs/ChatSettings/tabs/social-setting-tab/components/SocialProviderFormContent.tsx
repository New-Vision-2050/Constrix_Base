"use client";
import { useSocialProviderCxt } from "../context/SocialProviderCxt";
import FormContent from "./FormContent";

export default function SocialProviderFormContent() {
  const { activeSocialProvider } = useSocialProviderCxt();
  return (
    <>
      {activeSocialProvider?.formConfig && (
        <FormContent config={activeSocialProvider?.formConfig} />
      )}
    </>
  );
}
