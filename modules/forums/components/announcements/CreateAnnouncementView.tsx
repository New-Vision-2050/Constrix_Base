"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  FileText,
  ImageIcon,
  Megaphone,
  Mic,
  Send,
  X,
} from "lucide-react";
import { Alert } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { Link, useRouter } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { toast } from "@/modules/table/hooks/use-toast";
import SectionCard from "../ui/SectionCard";
import SwitchRow from "../ui/SwitchRow";
import InfoNote from "../ui/InfoNote";
import { readValidationErrors } from "../../api/client";
import {
  useAnnouncement,
  useSaveAnnouncement,
} from "../../hooks/use-announcements";
import { useCurrentCompany } from "../../hooks/use-company";
import { formatFileSize } from "../../utils/format";

const IMAGE_LIMIT = 10 * 1024 * 1024;
const FILE_LIMIT = 20 * 1024 * 1024;
const VOICE_TYPES = ["m4a", "aac", "mp3", "ogg", "wav", "webm"];

type Picked = { file: File; kind: "image" | "file" | "voice" };

export default function CreateAnnouncementView() {
  const t = useTranslations("Forums");
  const router = useRouter();
  const company = useCurrentCompany();

  // `?id=` turns the screen into an edit form; the design only shows create.
  const announcementId = useSearchParams().get("id");
  const existing = useAnnouncement(announcementId);
  const save = useSaveAnnouncement(announcementId);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notify, setNotify] = useState(true);
  const [attachments, setAttachments] = useState<Picked[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [attachmentError, setAttachmentError] = useState<string | null>(null);

  const imageInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const voiceInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!existing.data) return;
    setTitle(existing.data.title ?? "");
    setBody(existing.data.body ?? "");
    setNotify(existing.data.notify ?? true);
  }, [existing.data]);

  const pick = (file: File | undefined, kind: Picked["kind"]) => {
    if (!file) return;
    setAttachmentError(null);

    if (kind === "image" && file.size > IMAGE_LIMIT) {
      setAttachmentError(t("announcements.form.imageTooLarge"));
      return;
    }
    if (kind !== "image" && file.size > FILE_LIMIT) {
      setAttachmentError(
        kind === "voice"
          ? t("announcements.form.voiceTooLarge")
          : t("announcements.form.fileTooLarge"),
      );
      return;
    }
    if (kind === "voice") {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!VOICE_TYPES.includes(extension)) {
        setAttachmentError(t("announcements.form.voiceWrongType"));
        return;
      }
    }

    setAttachments((current) => [...current, { file, kind }]);
  };

  const submit = (status: "draft" | "published") => {
    if (!title.trim() || !body.trim()) {
      setErrors({
        ...(title.trim() ? {} : { title: [t("common.requiredField")] }),
        ...(body.trim() ? {} : { body: [t("common.requiredField")] }),
      });
      return;
    }
    setErrors({});

    save.mutate(
      {
        title: title.trim(),
        body: body.trim(),
        status,
        notify,
        attachments: attachments.map((item) => item.file),
      },
      {
        onSuccess: () => {
          toast({
            title:
              status === "draft"
                ? t("list.draftSaved")
                : t("announcements.form.published"),
          });
          router.push(`${ROUTER.FORUMS}?tab=announcements`);
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
    <div className="flex flex-col gap-5 p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link href={`${ROUTER.FORUMS}?tab=announcements`} className="hover:text-foreground">
              {t("announcements.title")}
            </Link>
            <ChevronRight className="size-3.5 rtl:rotate-180" />
            <span>{t("announcements.form.pageTitle")}</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            {t("announcements.form.pageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("announcements.form.pageSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => submit("draft")}
            loading={save.isPending}
          >
            {t("common.saveDraft")}
          </Button>
          <Button onClick={() => submit("published")} loading={save.isPending}>
            <Send />
            {t("announcements.form.publish")}
          </Button>
        </div>
      </header>

      {save.isError && !readValidationErrors(save.error) ? (
        <Alert severity="error">{t("common.saveFailed")}</Alert>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <SectionCard
          title={t("announcements.form.contentTitle")}
          hint={t("announcements.form.audience")}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                {t("announcements.form.title")}
                <span className="text-destructive"> *</span>
              </Label>
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              {errors.title ? (
                <p className="text-xs text-destructive">
                  {errors.title.join(" ")}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                {t("announcements.form.body")}
                <span className="text-destructive"> *</span>
              </Label>
              <Textarea
                rows={8}
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
              {errors.body ? (
                <p className="text-xs text-destructive">
                  {errors.body.join(" ")}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => imageInput.current?.click()}
              >
                <ImageIcon />
                {t("announcements.form.addImage")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInput.current?.click()}
              >
                <FileText />
                {t("announcements.form.addFile")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => voiceInput.current?.click()}
              >
                <Mic />
                {t("announcements.form.addVoice")}
              </Button>
            </div>

            <input
              ref={imageInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                pick(event.target.files?.[0], "image");
                event.target.value = "";
              }}
            />
            <input
              ref={fileInput}
              type="file"
              className="hidden"
              onChange={(event) => {
                pick(event.target.files?.[0], "file");
                event.target.value = "";
              }}
            />
            <input
              ref={voiceInput}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(event) => {
                pick(event.target.files?.[0], "voice");
                event.target.value = "";
              }}
            />

            {attachmentError ? (
              <Alert severity="warning">{attachmentError}</Alert>
            ) : null}

            {errors.attachments ? (
              <p className="text-xs text-destructive">
                {errors.attachments.join(" ")}
              </p>
            ) : null}

            {attachments.length > 0 ? (
              <div className="flex flex-col gap-2">
                {attachments.map((item, index) => (
                  <div
                    key={`${item.file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/40 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary [&_svg]:size-4">
                        {item.kind === "image" ? (
                          <ImageIcon />
                        ) : item.kind === "voice" ? (
                          <Mic />
                        ) : (
                          <FileText />
                        )}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm">
                          {item.file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(item.file.size)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("announcements.form.removeAttachment")}
                      onClick={() =>
                        setAttachments((current) =>
                          current.filter((_, position) => position !== index),
                        )
                      }
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            <SwitchRow
              label={t("announcements.form.notify")}
              hint={t("announcements.form.notifyHint")}
              checked={notify}
              onChange={setNotify}
            />

            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link href={`${ROUTER.FORUMS}?tab=announcements`}>
                  {t("announcements.form.cancel")}
                </Link>
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title={t("announcements.form.previewTitle")}
          action={
            <span className="rounded-md bg-primary/15 px-2 py-1 text-xs text-primary">
              {t("announcements.form.previewBadge")}
            </span>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-border bg-sidebar p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary [&_svg]:size-4">
                  <Megaphone />
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-foreground">
                    {company.name || t("announcements.form.previewAuthor")}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {t("announcements.form.previewAuthor")}
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-foreground">
                {title || t("announcements.form.previewEmptyTitle")}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-xs text-muted-foreground">
                {body || t("announcements.form.previewEmptyBody")}
              </p>

              {attachments.length > 0 ? (
                <div className="mt-3 flex flex-col gap-1.5">
                  {attachments.map((item, index) => (
                    <div
                      key={`preview-${item.file.name}-${index}`}
                      className="flex items-center gap-2 rounded-lg bg-background/60 p-2"
                    >
                      <span className="text-primary [&_svg]:size-3.5">
                        {item.kind === "image" ? (
                          <ImageIcon />
                        ) : item.kind === "voice" ? (
                          <Mic />
                        ) : (
                          <FileText />
                        )}
                      </span>
                      <span className="truncate text-[10px] text-foreground">
                        {item.file.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <InfoNote>{t("announcements.form.previewFooter")}</InfoNote>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
