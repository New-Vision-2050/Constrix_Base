"use client";

import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useAttendanceDirection } from "../../utils/direction";

interface AttendanceDialogShellProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function AttendanceDialogShell({
  open,
  onClose,
  children,
  className = "",
}: AttendanceDialogShellProps) {
  const { isRtl } = useAttendanceDirection();

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        className={`bg-sidebar border-border max-w-md w-[calc(100%-2rem)] p-6 sm:rounded-2xl ${className}`}
        withCrossButton={false}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-4 text-muted-foreground hover:text-foreground transition-colors ${
            isRtl ? "left-4" : "right-4"
          }`}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function AttendanceDialogIcon({
  children,
  variant = "warning",
}: {
  children: React.ReactNode;
  variant?: "warning" | "success";
}) {
  return (
    <div
      className={`mx-auto mb-5 flex size-14 items-center justify-center rounded-full ${
        variant === "success" ? "bg-primary" : "bg-primary"
      }`}
    >
      {children}
    </div>
  );
}

export function AttendanceDialogTime({
  time,
  period,
}: {
  time: string;
  period?: string;
}) {
  return (
    <div className="flex items-baseline justify-center gap-1.5 my-4" dir="ltr">
      <span className="text-4xl font-bold text-foreground tracking-tight">
        {time}
      </span>
      {period ? (
        <span className="text-2xl font-bold text-chart-4">{period}</span>
      ) : null}
    </div>
  );
}

export function AttendanceDialogDate({ label }: { label: string }) {
  return (
    <div className="flex justify-center">
      <span className="inline-block rounded-lg bg-muted/80 px-4 py-2 text-sm text-foreground">
        {label}
      </span>
    </div>
  );
}
