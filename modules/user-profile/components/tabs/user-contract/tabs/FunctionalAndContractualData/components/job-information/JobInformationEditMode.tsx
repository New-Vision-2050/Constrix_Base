"use client";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { JobFormConfig } from "./job-information-config";

export default function JobInformationEditMode() {
  const config = JobFormConfig();
  return <FormContent config={config} />;
}
