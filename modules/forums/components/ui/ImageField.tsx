"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ImageIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

/**
 * The "صورة المنتدى / PNG أو JPG / إدارة" row. Keeps the chosen `File` in the
 * caller's state and renders a local preview without uploading anything.
 */
export default function ImageField({
  label,
  hint,
  value,
  previewUrl,
  onChange,
  disabled,
}: {
  label: string;
  hint?: string;
  value: File | null;
  /** Existing image coming from the API, shown until a new file is picked. */
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const t = useTranslations("Forums");
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setLocalPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setLocalPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const preview = localPreview ?? previewUrl ?? null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center overflow-hidden rounded-lg bg-primary/15 text-primary">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={label}
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-5" />
          )}
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">
            {hint ?? t("common.pngOrJpg")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {value || previewUrl ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            aria-label={t("common.remove")}
            disabled={disabled}
          >
            <X />
          </Button>
        ) : null}
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
        >
          <ChevronLeft className="rtl:rotate-180" />
          {t("common.manage")}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
