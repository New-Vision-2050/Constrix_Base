import React, { memo, useEffect, useState } from "react";
import { Input } from "@/modules/table/components/ui/input";
import { FieldConfig } from "../../types/formTypes";
import { cn } from "@/lib/utils";
import { useFormInstance } from "../../hooks/useFormStore";
import { XCircle, CheckCircle } from "lucide-react";
import { hasApiValidation } from "../../utils/apiValidation";
import { useLocale } from "next-intl";

interface TextFieldProps {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode;
  touched?: boolean;
  type?: "text" | "email" | "password" | "number";
  onChange: (value: string) => void;
  onBlur: () => void;
  isValidating?: boolean;
  formId?: string;
}

const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  error,
  touched,
  type = "text",
  onChange,
  onBlur,
  isValidating,
  formId = "default",
}) => {
  // Track whether the field has been API validated
  const [hasBeenApiValidated, setHasBeenApiValidated] = useState(false);

  // Get the current locale to determine text direction
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Get form instance from the store
  const formInstance = useFormInstance(formId);
  const validatingFields = formInstance.validatingFields || {};
  const storeErrors = formInstance.errors || {};
  const isFieldValidating = isValidating || validatingFields[field.name];

  // Check for errors in both the form store and the local state
  const hasStoreError = !!storeErrors[field.name];
  const hasLocalError = !!error && touched;
  const showError = hasLocalError || hasStoreError;

  // Clear store error when value is empty
  useEffect(() => {
    if (hasStoreError && (!value || value === "")) {
      formInstance.setError(field.name, null);
    }
  }, [field.name, value, hasStoreError, formInstance]);

  // Check if this field has API validation
  const hasApiVal = field.validation
    ? hasApiValidation(field.validation)
    : false;

  // Track when API validation completes
  useEffect(() => {
    if (hasApiVal && !isFieldValidating && value) {
      setHasBeenApiValidated(true);
    }
  }, [hasApiVal, isFieldValidating, value]);

  // Determine if field has been validated successfully
  // A field is considered successfully validated if:
  // 1. It has API validation rules
  // 2. It has a value (not empty)
  // 3. It has no errors (both in local state and store)
  // 4. It's not currently being validated
  // 5. It has been validated by the API
  const hasValue = value !== undefined && value !== null && value !== "";
  const hasNoErrors = !hasLocalError && !hasStoreError;
  const isValidated =
    hasApiVal &&
    hasValue &&
    hasNoErrors &&
    !isFieldValidating &&
    hasBeenApiValidated;

  // Show icon if field is validating, has error, or has been successfully validated with API
  const showIcon = isFieldValidating || showError || isValidated;

  // Determine if we need to show a postfix
  const hasPostfix = !!field.postfix;

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
            isValidated ? "border-green-500" : "",
            hasPostfix ? "rtl:rounded-s-none ltr:rounded-e-none" : "", // Use logical properties (end) instead of directional (right)
            showIcon ? (isRtl ? "pl-8" : "pl-8") : "", // Add padding based on text direction
            hasPostfix ? "" : field.width ? field.width : "w-full",
            "focus-visible:ring-0"
          )}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          dir={isRtl ? "rtl" : "ltr"} // Set direction based on locale
        />
        {hasPostfix && (
          <div
            className="inline-flex items-center px-3 text-sm text-white bg-primary border border-s-0 border-input rounded-e-md relative z-10"
            dir="ltr" // Force LTR direction for the postfix
          >
            {field.postfix}
          </div>
        )}
      </div>
      {showIcon && (
        <div
          className={cn(
            "absolute transform top-3 z-20",
            isRtl ? "left-2.5" : "left-2.5"
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

      {/* Error message */}
      {showError && (
        <div className="text-destructive text-sm mt-1">
          {error || storeErrors[field.name]}
        </div>
      )}
    </div>
  );
};

export default memo(TextField);
