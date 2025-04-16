import React, { memo, useEffect, useState, useCallback } from "react";
import { Input } from "@/modules/table/components/ui/input";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance, validateField, useFormStore } from "../../hooks/useFormStore";
import { XCircle, CheckCircle } from "lucide-react";
import { hasApiValidation, triggerApiValidation } from "../../utils/apiValidation";
import { useLocale, useTranslations } from "next-intl"; // Added useTranslations import

interface TextFieldProps {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode; // Error from external validation (e.g., RHF)
  touched?: boolean; // Touched state from external validation
  type?: "text" | "email" | "password" | "number";
  onChange: (value: string) => void;
  onBlur: () => void; // Original onBlur prop (likely just sets touched)
  isValidating?: boolean; // Prop for external validation state (e.g., RHF)
  formId?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  error, // External error
  touched, // External touched state
  type = "text",
  onChange,
  onBlur, // Original onBlur prop
  isValidating, // External validating prop
  formId = 'default',
}) => {
  const [hasBeenApiValidated, setHasBeenApiValidated] = useState(false);
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations('FormBuilder.Fields.Image'); // Assuming translations are needed

  const {
    setError: setStoreError,
    values: formValues,
    errors: storeErrors,
    validatingFields,
    validateFieldWithApi: triggerApiValidationAction
  } = useFormInstance(formId);

  const isFieldValidating = isValidating || validatingFields?.[field.name];
  const combinedError = error || storeErrors?.[field.name];
  const showError = !!combinedError && touched;

  const hasApiValRule = field.validation ? hasApiValidation(field.validation) : false;

  // Determine validation mode: Use explicit config, or default based on API validation presence
  const validateMode = field.validateOn || (hasApiValRule ? 'change' : 'blur');

  // Reset API validation status if value changes
  useEffect(() => {
    setHasBeenApiValidated(false);
  }, [value]);

  // Track API validation completion
  useEffect(() => {
    if (hasApiValRule && !isFieldValidating && value && !combinedError) {
       setHasBeenApiValidated(true);
    }
  }, [hasApiValRule, isFieldValidating, value, combinedError]);


  const hasValue = value !== undefined && value !== null && value !== "";
  const isValidated = hasValue && !showError && !isFieldValidating && (!hasApiValRule || hasBeenApiValidated);
  const showIcon = isFieldValidating || showError || (isValidated && hasApiValRule);
  const hasPostfix = !!field.postfix;

  // Centralized validation function
  const runValidation = useCallback((currentValue: string) => {
    const syncError = validateField(currentValue, field.validation, formValues, field.name, useFormStore.getState(), formId);
    setStoreError(field.name, syncError);

    if (!syncError) {
      const apiRule = field.validation?.find(rule => rule.type === 'apiValidation');
      if (apiRule) {
        triggerApiValidationAction(field.name, currentValue, apiRule);
        setHasBeenApiValidated(false); // Reset status until API call completes
      } else {
        setHasBeenApiValidated(true); // Mark as validated if only sync rules pass
      }
    } else {
      setHasBeenApiValidated(false); // Reset if sync validation fails
    }
  }, [field, formValues, formId, setStoreError, triggerApiValidationAction]);

  // Handle change event
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue); // Update the value in the parent/store

    if (validateMode === 'change') {
      runValidation(newValue);
    } else {
      // Clear errors immediately if field becomes empty when validating on blur/submit
      if (storeErrors?.[field.name] && newValue === "") {
         setStoreError(field.name, null);
      }
      // Reset API validated status on change if not validating on change
      setHasBeenApiValidated(false);
    }
  }, [onChange, validateMode, runValidation, field.name, storeErrors, setStoreError]);

  // Handle blur event
  const handleBlur = useCallback(() => {
    onBlur(); // Call original onBlur (sets touched)
    if (validateMode === 'blur') {
      runValidation(value); // Validate current value on blur
    }
  }, [onBlur, validateMode, runValidation, value]);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex flex-row",
          field.width ? field.width : "w-full",
          field.containerClassName
        )}
      >
        <Input
          id={field.name}
          name={field.name}
          type={type}
          value={value || ""}
          placeholder={field.placeholder}
          disabled={field.disabled}
          readOnly={field.readOnly}
          autoFocus={field.autoFocus}
          className={cn(
            field.className,
            showError ? "border-destructive" : "",
            isValidated && !showError ? "border-green-500" : "",
            hasPostfix ? "rtl:rounded-s-none ltr:rounded-e-none" : "",
            showIcon ? (isRtl ? "pl-8" : "pr-8") : "",
            hasPostfix ? "" : field.width ? field.width : "w-full"
          )}
          onChange={handleChange}
          onBlur={handleBlur}
          dir={isRtl ? "rtl" : "ltr"}
        />
        {hasPostfix && (
          <div
            className="inline-flex items-center px-3 text-sm text-white bg-primary border border-s-0 border-input rounded-e-md relative z-10"
            dir="ltr"
          >
            {field.postfix}
          </div>
        )}
      </div>
      {showIcon && (
        <div
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 z-20",
            isRtl ? (hasPostfix ? 'left-[calc(theme(spacing.3)_+_1rem)]' : 'left-2.5')
                  : (hasPostfix ? 'right-[calc(theme(spacing.3)_+_1rem)]' : 'right-2.5')
          )}
        >
          {isFieldValidating ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : showError ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : isValidated ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default memo(TextField);
