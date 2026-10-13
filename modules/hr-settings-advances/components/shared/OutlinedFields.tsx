"use client";

import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useFormInstance } from "@/modules/form-builder";

function FieldError({ formId, name }: { formId: string; name: string }) {
  const { errors, touched } = useFormInstance(formId);
  const error = errors?.[name];
  if (!error || !touched?.[name]) return null;

  return <p className="mt-1 text-xs text-destructive">{String(error)}</p>;
}

function WithHeading({
  heading,
  children,
}: {
  heading?: string;
  children: React.ReactNode;
}) {
  if (!heading) return <>{children}</>;
  return (
    <div className="flex flex-col gap-4 pt-2">
      <h3 className="text-base font-semibold">{heading}</h3>
      {children}
    </div>
  );
}

export function OutlinedTextField({
  formId,
  name,
  label,
  value,
  placeholder,
  onChange,
  heading,
  required,
  type = "text",
  step,
}: {
  formId: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  heading?: string;
  required?: boolean;
  type?: "text" | "number";
  step?: string;
}) {
  return (
    <WithHeading heading={heading}>
      <div>
        <fieldset className="rounded-md border border-white/25 px-3 pb-2.5 pt-1">
          <legend className="px-1 text-xs text-white/70">
            {label}
            {required ? "*" : null}
          </legend>
          <input
            name={name}
            type={type}
            min={type === "number" ? 0 : undefined}
            step={step}
            value={value || ""}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-white/40"
          />
        </fieldset>
        <FieldError formId={formId} name={name} />
      </div>
    </WithHeading>
  );
}

export function OutlinedSelectField({
  formId,
  name,
  label,
  value,
  placeholder,
  options,
  onChange,
  heading,
  required,
}: {
  formId: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  heading?: string;
  required?: boolean;
}) {
  return (
    <WithHeading heading={heading}>
      <div>
        <fieldset className="rounded-md border border-white/25 px-3 pb-2.5 pt-1">
          <legend className="px-1 text-xs text-white/70">
            {label}
            {required ? "*" : null}
          </legend>
          <div className="relative">
            <select
              name={name}
              value={value || ""}
              onChange={(event) => onChange(event.target.value)}
              className="w-full appearance-none bg-transparent py-1 pe-2 ps-6 text-sm outline-none [&>option]:bg-sidebar"
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
          </div>
        </fieldset>
        <FieldError formId={formId} name={name} />
      </div>
    </WithHeading>
  );
}

export function SwitchRowField({
  label,
  heading,
  value,
  onChange,
}: {
  label: string;
  heading?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <WithHeading heading={heading}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">{label}</span>
        <Switch
          checked={Boolean(value)}
          onCheckedChange={onChange}
          aria-label={label}
        />
      </div>
    </WithHeading>
  );
}
