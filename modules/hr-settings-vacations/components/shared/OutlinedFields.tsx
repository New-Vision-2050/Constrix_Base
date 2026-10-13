"use client";

import { ChevronDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useFormInstance } from "@/modules/form-builder";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

function FieldError({ formId, name }: { formId: string; name: string }) {
  const { errors, touched } = useFormInstance(formId);
  const error = errors?.[name];
  if (!error || !touched?.[name]) return null;

  return <p className="mt-1 text-xs text-destructive">{String(error)}</p>;
}

function OutlinedControl({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-md border border-white/25 px-3 pb-2.5 pt-1">
      <legend className="px-1 text-xs text-white/70">
        {label}
        {required ? "*" : null}
      </legend>
      {children}
    </fieldset>
  );
}

export function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-base font-semibold">{title}</h3>;
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
      <SectionTitle title={heading} />
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
}) {
  return (
    <WithHeading heading={heading}>
      <div>
        <OutlinedControl label={label} required={required}>
          <input
            name={name}
            type={type}
            min={type === "number" ? 0 : undefined}
            value={value || ""}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-white/40"
          />
        </OutlinedControl>
        <FieldError formId={formId} name={name} />
      </div>
    </WithHeading>
  );
}

export function OutlinedTextareaField({
  formId,
  name,
  label,
  value,
  placeholder,
  onChange,
}: {
  formId: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <OutlinedControl label={label}>
        <textarea
          name={name}
          rows={3}
          value={value || ""}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full resize-none bg-transparent py-1 text-sm outline-none placeholder:text-white/40"
        />
      </OutlinedControl>
      <FieldError formId={formId} name={name} />
    </div>
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
  disabled,
}: {
  formId: string;
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  options: Option[];
  onChange: (value: string) => void;
  heading?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <WithHeading heading={heading}>
      <div>
        <OutlinedControl label={label} required={required}>
          <div className="relative">
            <select
              name={name}
              value={value || ""}
              disabled={disabled}
              onChange={(event) => onChange(event.target.value)}
              className="w-full appearance-none bg-transparent py-1 pe-2 ps-6 text-sm outline-none disabled:opacity-60 [&>option]:bg-sidebar"
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
        </OutlinedControl>
        <FieldError formId={formId} name={name} />
      </div>
    </WithHeading>
  );
}

export function RadioCardsField({
  formId,
  name,
  value,
  options,
  onChange,
  heading,
}: {
  formId: string;
  name: string;
  value: string;
  options: (Option & { description?: string })[];
  onChange: (value: string) => void;
  heading?: string;
}) {
  return (
    <WithHeading heading={heading}>
      <div role="radiogroup" className="flex flex-col gap-3">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-start transition-colors",
                checked ? "border-primary" : "border-white/25",
              )}
            >
              <span className="flex flex-col">
                <span className="text-sm">{option.label}</span>
                {option.description ? (
                  <span className="text-xs text-white/50">
                    {option.description}
                  </span>
                ) : null}
              </span>
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                  checked ? "border-primary" : "border-white/40",
                )}
              >
                {checked ? (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                ) : null}
              </span>
            </button>
          );
        })}
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
