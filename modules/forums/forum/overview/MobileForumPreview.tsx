"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Megaphone, MessagesSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * «معاينة المنتدى على الموبايل» — a static mock, no API call, as the spec allows.
 */
export default function MobileForumPreview({
  forumName,
  companyName,
  trigger,
}: {
  forumName: string;
  companyName: string;
  trigger: ReactNode;
}) {
  const t = useTranslations("Forums");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("forum.overview.mobilePreview")}</DialogTitle>
          <DialogDescription>
            {t("forum.overview.mobilePreviewHint")}
          </DialogDescription>
        </DialogHeader>

        <div className="mx-auto w-[260px] rounded-[2rem] border-4 border-border bg-sidebar p-3">
          <div className="mb-3 flex flex-col gap-0.5">
            <span className="text-xs text-primary">{companyName}</span>
            <span className="text-sm font-semibold text-foreground">
              {forumName}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-background/60 p-2.5">
              <Megaphone className="size-4 text-primary" />
              <span className="text-xs text-foreground">
                {t("announcements.title")}
              </span>
            </div>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg bg-background/40 p-2.5"
              >
                <MessagesSquare className="size-4 text-muted-foreground" />
                <span className="h-2 flex-1 rounded bg-muted-foreground/25" />
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            {t("announcements.form.previewFooter")}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
