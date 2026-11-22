"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Archive, ArchiveRestore, Check } from "lucide-react";
import { Alert } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Input } from "@/modules/table/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { toast } from "@/modules/table/hooks/use-toast";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import ForumShell from "../components/ForumShell";
import SectionCard from "../../components/ui/SectionCard";
import ChoiceCard from "../../components/ui/ChoiceCard";
import ImageField from "../../components/ui/ImageField";
import ScopePicker from "../../components/ui/ScopePicker";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { readValidationErrors } from "../../api/client";
import {
  useArchiveForum,
  useForum,
  useRestoreForum,
  useUpdateForum,
} from "../../hooks/use-forums";
import { useCurrentCompany } from "../../hooks/use-company";
import { formatDate } from "../../utils/format";
import type { ForumVisibility } from "../../types";

export default function ForumSettingsView({ forumId }: { forumId: string }) {
  const t = useTranslations("Forums");
  const locale = useLocale();
  const company = useCurrentCompany();
  const { can } = usePermissions();

  const { data: forum, isLoading } = useForum(forumId);
  const update = useUpdateForum(forumId);
  const archive = useArchiveForum();
  const restore = useRestoreForum();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<ForumVisibility>("company");
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [confirmArchive, setConfirmArchive] = useState(false);

  // Hydrate the form once the forum arrives.
  useEffect(() => {
    if (!forum) return;
    setName(forum.name ?? "");
    setDescription(forum.description ?? "");
    setDetails(forum.details ?? "");
    setVisibility(forum.visibility ?? "company");
    setBranchIds(forum.branch_ids ?? []);
    setProjectIds(forum.project_ids ?? []);
  }, [forum]);

  const save = () => {
    setErrors({});
    update.mutate(
      {
        name: name.trim(),
        description: description.trim(),
        details: details.trim() ? details.trim() : null,
        visibility,
        // Switching back to `company` clears the scope on save.
        branch_ids: visibility === "scoped" ? branchIds : [],
        project_ids: visibility === "scoped" ? projectIds : [],
        logo,
      },
      {
        onSuccess: () => {
          setLogo(null);
          toast({ title: t("common.saved") });
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

  const isArchived = forum?.status === "archived";

  return (
    <ForumShell
      forumId={forumId}
      active="settings"
      title={t("forum.settings.title")}
      breadcrumb={t("forum.settings.breadcrumb")}
      action={
        can([PERMISSIONS.forum.update]) ? (
          <Button onClick={save} loading={update.isPending}>
            <Check />
            {t("forum.settings.save")}
          </Button>
        ) : null
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title={t("forum.settings.dataTitle")}
            hint={t("forum.settings.dataHint")}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  {t("forum.settings.name")}
                  <span className="text-destructive"> *</span>
                </Label>
                <Input
                  className="h-9"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isLoading}
                />
                {errors.name ? (
                  <p className="text-xs text-destructive">
                    {errors.name.join(" ")}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  {t("forum.settings.description")}
                </Label>
                <Textarea
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isLoading}
                />
                {errors.description ? (
                  <p className="text-xs text-destructive">
                    {errors.description.join(" ")}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  {t("wizard.basic.details")}
                </Label>
                <Textarea
                  rows={2}
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  disabled={isLoading}
                />
              </div>

              <ImageField
                label={t("wizard.basic.logo")}
                value={logo}
                previewUrl={forum?.logo_url}
                onChange={setLogo}
              />
            </div>
          </SectionCard>

          <SectionCard
            title={t("forum.settings.visibilityTitle")}
            hint={t("forum.settings.visibilityHint")}
          >
            <div className="flex flex-col gap-3">
              <ChoiceCard
                title={t("visibility.company")}
                hint={t("forum.settings.companyHint", {
                  company: company.name,
                })}
                selected={visibility === "company"}
                onSelect={() => setVisibility("company")}
              />
              <ChoiceCard
                title={t("visibility.scoped")}
                hint={t("forum.settings.scopedHint")}
                selected={visibility === "scoped"}
                onSelect={() => setVisibility("scoped")}
              />

              <div className="flex flex-col gap-2">
                <Label className="text-xs text-muted-foreground">
                  {t("forum.settings.scopeField")}
                </Label>
                {visibility === "scoped" ? (
                  <ScopePicker
                    branchIds={branchIds}
                    projectIds={projectIds}
                    onBranchesChange={setBranchIds}
                    onProjectsChange={setProjectIds}
                  />
                ) : (
                  <div className="flex h-9 items-center rounded-md border border-border px-3 text-sm text-muted-foreground">
                    {t("forum.settings.scopePlaceholder")}
                  </div>
                )}
                {errors.branch_ids || errors.project_ids ? (
                  <p className="text-xs text-destructive">
                    {t("forum.settings.scopedHint")}
                  </p>
                ) : null}
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-foreground">
                  {t("forum.settings.archiveTitle")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("forum.settings.archiveHint")}
                </span>
              </div>
              {can([PERMISSIONS.forum.archive]) ? (
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => setConfirmArchive(true)}
                  disabled={isArchived}
                >
                  <Archive />
                  {t("forum.settings.archive")}
                </Button>
              ) : null}
            </div>

            {isArchived ? (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">
                    {forum?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t("forum.settings.archivedSince", {
                      date: formatDate(forum?.archived_at, locale),
                    })}
                  </span>
                </div>
                {can([PERMISSIONS.forum.restore]) ? (
                  <Button
                    variant="outline"
                    onClick={() => restore.mutate(forumId)}
                    loading={restore.isPending}
                  >
                    <ArchiveRestore />
                    {t("forum.settings.restore")}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </SectionCard>

        {update.isError && !readValidationErrors(update.error) ? (
          <Alert severity="error">{t("common.saveFailed")}</Alert>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmArchive}
        title={t("list.archiveConfirmTitle")}
        body={t("list.archiveConfirmBody")}
        confirmLabel={t("forum.settings.archive")}
        destructive
        loading={archive.isPending}
        onConfirm={() =>
          archive.mutate(forumId, { onSettled: () => setConfirmArchive(false) })
        }
        onClose={() => setConfirmArchive(false)}
      />
    </ForumShell>
  );
}
