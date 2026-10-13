"use client";

import { useEffect, useRef } from "react";
import FormContent from "@/modules/settings/components/tabs/ChatSettings/tabs/email-setting-tab/components/FormContent";
import { FormConfig, useFormStore } from "@/modules/form-builder";

type Props = {
  config: FormConfig;
};

export default function ContractSystemForm({ config }: Props) {
  const formId = config.formId ?? "contract-system-form";
  const serializedInitialValues = JSON.stringify(config.initialValues ?? {});
  const didInitRef = useRef(false);

  useEffect(() => {
    const initialValues = JSON.parse(serializedInitialValues) as Record<
      string,
      unknown
    >;
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
  }, [formId, serializedInitialValues]);

  return <FormContent config={config} />;
}
