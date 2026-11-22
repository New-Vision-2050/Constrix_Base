"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, Check } from "lucide-react";
import { Alert } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "@/modules/table/hooks/use-toast";
import { useRouter } from "@i18n/navigation";
import { ROUTER } from "@/router";
import { readValidationErrors } from "../../api/client";
import { useCreateForum } from "../../hooks/use-forums";
import { formatNumber } from "../../utils/format";
import WizardStepper from "./WizardStepper";
import BasicDataStep from "./steps/BasicDataStep";
import AdminsStep from "./steps/AdminsStep";
import MembersStep from "./steps/MembersStep";
import ReviewStep from "./steps/ReviewStep";
import {
  WIZARD_STEPS,
  useCreateForumWizard,
} from "./useCreateForumWizard";

/**
 * Four steps, one request. The whole wizard lives in client state; `POST
 * /forums` runs once with `status: "draft"` or `status: "published"`.
 */
export default function CreateForumWizard({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("Forums");
  const locale = useLocale();
  const router = useRouter();
  const wizard = useCreateForumWizard();
  const createForum = useCreateForum();

  const isLast = wizard.step === "review";

  const submit = (status: "draft" | "published") => {
    const reported = wizard.validate(status);
    if (Object.keys(reported).length > 0) {
      wizard.focusFirstError(reported);
      return;
    }

    createForum.mutate(wizard.buildBody(status), {
      onSuccess: (forum) => {
        if (status === "draft") {
          // Draft: stay on the list, the new row shows as مسودة.
          toast({ title: t("list.draftSaved") });
          onClose();
          return;
        }
        onClose();
        if (forum?.id) router.push(ROUTER.FORUM_DETAILS(forum.id));
      },
      onError: (error) => {
        const fieldErrors = readValidationErrors(error);
        if (fieldErrors) {
          wizard.setErrors(fieldErrors);
          wizard.focusFirstError(fieldErrors);
          return;
        }
        toast({ variant: "destructive", title: t("common.saveFailed") });
      },
    });
  };

  const stepHint = {
    basic: t("wizard.basic.hint"),
    admins: t("wizard.admins.hint"),
    members: t("wizard.members.hint"),
    review: t("wizard.review.hint"),
  }[wizard.step];

  const stepHeading = {
    basic: t("wizard.basic.heading"),
    admins: t("wizard.admins.heading"),
    members: t("wizard.members.heading"),
    review: t("wizard.review.heading"),
  }[wizard.step];

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="left"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-[560px]"
      >
        <header className="flex flex-col gap-4 border-b border-border p-5">
          <div className="flex flex-col gap-1 pe-8">
            <h2 className="text-lg font-semibold text-foreground">
              {t("wizard.titlePrefix")} / {stepHeading}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("wizard.stepOf", {
                current: formatNumber(wizard.stepIndex + 1, locale),
                total: formatNumber(WIZARD_STEPS.length, locale),
              })}{" "}
              · {stepHint}
            </p>
          </div>
          <WizardStepper current={wizard.step} onSelect={wizard.setStep} />
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {createForum.isError && !readValidationErrors(createForum.error) ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {t("common.saveFailed")}
            </Alert>
          ) : null}

          {wizard.step === "basic" ? <BasicDataStep wizard={wizard} /> : null}
          {wizard.step === "admins" ? <AdminsStep wizard={wizard} /> : null}
          {wizard.step === "members" ? <MembersStep wizard={wizard} /> : null}
          {wizard.step === "review" ? <ReviewStep wizard={wizard} /> : null}
        </div>

        <footer className="flex items-center gap-2 border-t border-border p-4">
          {isLast ? (
            <Button
              className="flex-1"
              onClick={() => submit("published")}
              loading={createForum.isPending}
              disabled={!wizard.canPublish}
            >
              <Check />
              {t("wizard.review.publish")}
            </Button>
          ) : (
            <Button
              className="flex-1"
              onClick={wizard.goNext}
              disabled={wizard.step === "basic" && !wizard.canSaveDraft}
            >
              <ChevronLeft className="rtl:rotate-180" />
              {wizard.step === "members"
                ? t("wizard.members.reviewForum")
                : t("common.next")}
            </Button>
          )}

          {/* The design offers the draft shortcut on the first and last steps. */}
          {wizard.step === "basic" || isLast ? (
            <Button
              variant="outline"
              onClick={() => submit("draft")}
              loading={createForum.isPending}
              disabled={!wizard.canSaveDraft}
            >
              {t("common.saveDraft")}
            </Button>
          ) : null}

          {wizard.step === "basic" ? (
            <Button variant="outline" onClick={onClose}>
              {t("common.cancel")}
            </Button>
          ) : (
            <Button variant="outline" onClick={wizard.goBack}>
              {t("common.previous")}
            </Button>
          )}
        </footer>
      </SheetContent>
    </Sheet>
  );
}
