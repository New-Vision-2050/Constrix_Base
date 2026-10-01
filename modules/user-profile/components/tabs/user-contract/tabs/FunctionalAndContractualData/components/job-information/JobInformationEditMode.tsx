"use client";
import { useEffect, useRef } from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { useFormStore } from "@/modules/form-builder";
import { JobFormConfig } from "./job-information-config";

export default function JobInformationEditMode() {
  const config = JobFormConfig();
  const formId = config.formId ?? "job-data-form";
  const serializedInitialValues = JSON.stringify(config.initialValues ?? {});
  const didInitRef = useRef(false);

  // The form store's initForm only initializes a form once and ignores
  // updated initialValues for already-registered forms, which can leave
  // stale/empty values when the edit view is opened. Sync the latest
  // initial values here on every mount, and fill still-empty fields when
  // data arrives later without overwriting in-progress edits.
  useEffect(() => {
    const initialValues = config.initialValues ?? {};
    const store = useFormStore.getState();

    if (!didInitRef.current) {
      didInitRef.current = true;
      store.setValues(formId, initialValues, false);
      return;
    }

    const currentValues = store.getValues(formId) ?? {};
    const patch = Object.fromEntries(
      Object.entries(initialValues).filter(([key, value]) => {
        if (value === undefined || value === null) return false;
        const existing = currentValues[key];
        return (
          existing === undefined ||
          existing === null ||
          existing === "" ||
          (Array.isArray(existing) && existing.length === 0)
        );
      }),
    );

    if (Object.keys(patch).length > 0) {
      store.setValues(formId, patch, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, serializedInitialValues]);

  return <FormContent config={config} />;
}
