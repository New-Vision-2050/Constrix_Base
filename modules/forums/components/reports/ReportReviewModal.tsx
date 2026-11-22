"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, FileText, Info } from "lucide-react";
import { Alert } from "@mui/material";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { toast } from "@/modules/table/hooks/use-toast";
import StatusChip from "../ui/StatusChip";
import ChoiceCard from "../ui/ChoiceCard";
import InfoNote from "../ui/InfoNote";
import { readValidationErrors } from "../../api/client";
import { useResolveReport } from "../../hooks/use-reports";
import { reportStatusLabel, reportStatusTone } from "../../utils/labels";
import { formatDateTime, formatFileSize } from "../../utils/format";
import type { ForumReport, ReportAction } from "../../types";

/**
 * «مراجعة البلاغ» — the decision needs a note, which the API also requires.
 */
export default function ReportReviewModal({
  forumId,
  forumName,
  report,
  onClose,
}: {
  forumId: string;
  forumName: string;
  report: ForumReport;
  onClose: () => void;
}) {
  const t = useTranslations("Forums");
  const locale = useLocale();
  const resolve = useResolveReport(forumId);

  const [action, setAction] = useState<ReportAction>("delete_message");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const submit = () => {
    if (!note.trim()) {
      setErrors({ note: [t("reports.modal.noteRequired")] });
      return;
    }
    setErrors({});

    resolve.mutate(
      { reportId: report.id, action, note: note.trim() },
      {
        onSuccess: () => {
          toast({ title: t("common.saved") });
          onClose();
        },
        onError: (error) => {
          const fieldErrors = readValidationErrors(error);
          if (fieldErrors) {
            setErrors(fieldErrors);
            return;
          }
          toast({ variant: "destructive", title: t("common.saveFailed") });
        },
      },
    );
  };

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("reports.modal.title")}</DialogTitle>
          <DialogDescription>
            {t("reports.modal.subtitle", {
              id: report.id,
              forum: forumName,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {resolve.isError && !readValidationErrors(resolve.error) ? (
            <Alert severity="error">{t("common.saveFailed")}</Alert>
          ) : null}

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/40 p-4">
            <span className="text-sm font-medium text-foreground">
              {t("reports.modal.dataTitle")}
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label={t("reports.modal.group")}
                value={report.group_name}
              />
              <Field
                label={t("reports.modal.reporter")}
                value={report.reporter?.name ?? "—"}
              />
              <Field
                label={t("reports.modal.sender")}
                value={report.message?.sender?.name ?? "—"}
              />
              <Field
                label={t("reports.modal.reportDate")}
                value={formatDateTime(report.created_at, locale)}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {t("reports.modal.status")}
                </span>
                <StatusChip
                  label={reportStatusLabel(report.status, t)}
                  tone={reportStatusTone(report.status)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/40 p-4">
            <span className="text-sm font-medium text-foreground">
              {t("reports.modal.messageTitle")}
            </span>
            <p className="whitespace-pre-wrap text-sm text-foreground/80">
              {report.message?.body ?? "—"}
            </p>
            {report.message?.attachments?.length ? (
              <div className="flex flex-col gap-2">
                {report.message.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-sidebar p-2.5 text-xs text-foreground hover:border-primary/40"
                  >
                    <FileText className="size-4 text-primary" />
                    <span className="truncate">{attachment.name}</span>
                    <span className="ms-auto shrink-0 text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">
              {t("reports.modal.decisionTitle")}
            </span>
            <ChoiceCard
              title={t("reports.modal.deleteMessage")}
              hint={t("reports.modal.deleteMessageHint")}
              selected={action === "delete_message"}
              onSelect={() => setAction("delete_message")}
            />
            <ChoiceCard
              title={t("reports.modal.keepMessage")}
              hint={t("reports.modal.keepMessageHint")}
              selected={action === "keep_message"}
              onSelect={() => setAction("keep_message")}
            />

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                {t("reports.modal.note")}
                <span className="text-destructive"> *</span>
              </Label>
              <Textarea
                rows={3}
                value={note}
                placeholder={t("reports.modal.notePlaceholder")}
                onChange={(event) => setNote(event.target.value)}
              />
              {errors.note ? (
                <p className="text-xs text-destructive">
                  {errors.note.join(" ")}
                </p>
              ) : null}
            </div>

            <InfoNote icon={<Info />}>
              {t("reports.modal.decisionHint")}
            </InfoNote>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-start">
          <Button onClick={submit} loading={resolve.isPending}>
            <Check />
            {t("reports.modal.submit")}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t("reports.modal.back")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="truncate text-xs text-foreground">{value}</span>
    </div>
  );
}
