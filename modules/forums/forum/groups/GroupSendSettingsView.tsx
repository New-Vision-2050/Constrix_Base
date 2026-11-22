"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Eye, Image as ImageIcon, Info, Type } from "lucide-react";
import { Alert } from "@mui/material";
import { Button } from "@/components/ui/button";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { toast } from "@/modules/table/hooks/use-toast";
import ForumShell from "../components/ForumShell";
import SectionCard from "../../components/ui/SectionCard";
import ChoiceCard from "../../components/ui/ChoiceCard";
import SwitchRow from "../../components/ui/SwitchRow";
import InfoNote from "../../components/ui/InfoNote";
import MultiSelect from "../../components/ui/MultiSelect";
import { readValidationErrors } from "../../api/client";
import {
  useGroupMembers,
  useGroupsList,
  useSaveSendSettings,
} from "../../hooks/use-groups";
import type { SendPermission } from "../../types";

export default function GroupSendSettingsView({
  forumId,
  groupId,
}: {
  forumId: string;
  groupId: string;
}) {
  const t = useTranslations("Forums");
  const { can } = usePermissions();

  const groups = useGroupsList(forumId, { per_page: 100 });
  const group = groups.data?.items.find((item) => item.id === groupId);
  const members = useGroupMembers(forumId, groupId);
  const save = useSaveSendSettings(forumId, groupId);

  const [sendPermission, setSendPermission] =
    useState<SendPermission>("admins_only");
  const [allowedUserIds, setAllowedUserIds] = useState<string[]>([]);
  const [allowImages, setAllowImages] = useState(false);
  const [allowVoice, setAllowVoice] = useState(false);
  const [allowFiles, setAllowFiles] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!group || hydrated) return;
    setSendPermission(group.send_permission);
    setAllowedUserIds(group.allowed_user_ids ?? []);
    setAllowImages(group.allow_images);
    setAllowVoice(group.allow_voice);
    setAllowFiles(group.allow_files);
    setHydrated(true);
  }, [group, hydrated]);

  const canEdit = can([PERMISSIONS.forum.group.update]);

  const submit = () => {
    save.mutate(
      {
        send_permission: sendPermission,
        // Only the «أعضاء محددون» mode carries an allow list.
        allowed_user_ids:
          sendPermission === "specific_members" ? allowedUserIds : [],
        allow_images: allowImages,
        allow_voice: allowVoice,
        allow_files: allowFiles,
      },
      {
        onSuccess: () => toast({ title: t("common.saved") }),
        onError: (error) => {
          if (readValidationErrors(error)) return;
          toast({ variant: "destructive", title: t("common.saveFailed") });
        },
      },
    );
  };

  const memberOptions = (members.data?.items ?? []).map((member) => ({
    id: member.user_id,
    name: member.name,
  }));

  return (
    <ForumShell
      forumId={forumId}
      active="groups"
      title={t("forum.sendSettings.title", { group: group?.name ?? "" })}
      breadcrumb={t("forum.groups.breadcrumb")}
      action={
        canEdit ? (
          <Button onClick={submit} loading={save.isPending}>
            <Check />
            {t("forum.sendSettings.save")}
          </Button>
        ) : null
      }
    >
      <div className="flex flex-col gap-5">
        {save.isError && !readValidationErrors(save.error) ? (
          <Alert severity="error">{t("common.saveFailed")}</Alert>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title={t("forum.sendSettings.whoCanSend")}
            hint={t("forum.sendSettings.whoCanSendHint")}
          >
            <div className="flex flex-col gap-3">
              <ChoiceCard
                title={t("sendPermission.admins_only")}
                hint={t("forum.sendSettings.adminsOnlyHint")}
                selected={sendPermission === "admins_only"}
                onSelect={() => setSendPermission("admins_only")}
                disabled={!canEdit}
              />
              <ChoiceCard
                title={t("sendPermission.all_members")}
                hint={t("forum.sendSettings.allMembersHint")}
                selected={sendPermission === "all_members"}
                onSelect={() => setSendPermission("all_members")}
                disabled={!canEdit}
              />
              <ChoiceCard
                title={t("sendPermission.specific_members")}
                hint={t("forum.sendSettings.specificMembersHint")}
                selected={sendPermission === "specific_members"}
                onSelect={() => setSendPermission("specific_members")}
                disabled={!canEdit}
              >
                <MultiSelect
                  label={t("forum.sendSettings.editSelection")}
                  placeholder={t("common.allGroups")}
                  options={memberOptions}
                  value={allowedUserIds}
                  onChange={setAllowedUserIds}
                  loading={members.isLoading}
                  disabled={!canEdit}
                />
              </ChoiceCard>
            </div>
          </SectionCard>

          <SectionCard
            title={t("forum.sendSettings.allowedMedia")}
            hint={t("forum.sendSettings.allowedMediaHint")}
          >
            <div className="flex flex-col gap-3">
              <SwitchRow
                label={t("forum.sendSettings.images")}
                hint={t("forum.sendSettings.imagesHint")}
                checked={allowImages}
                onChange={setAllowImages}
                disabled={!canEdit}
              />
              <SwitchRow
                label={t("forum.sendSettings.voice")}
                hint={t("forum.sendSettings.voiceHint")}
                checked={allowVoice}
                onChange={setAllowVoice}
                disabled={!canEdit}
              />
              <SwitchRow
                label={t("forum.sendSettings.files")}
                hint={t("forum.sendSettings.filesHint")}
                checked={allowFiles}
                onChange={setAllowFiles}
                disabled={!canEdit}
              />
              <InfoNote icon={<Info />}>
                {t("forum.sendSettings.readHint")}
              </InfoNote>
            </div>
          </SectionCard>
        </div>

        <SectionCard title={t("forum.sendSettings.mobilePreview")}>
          <div className="grid gap-4 sm:grid-cols-3">
            <PreviewTile
              icon={<Eye />}
              title={t("forum.sendSettings.previewReadOnly")}
              active={sendPermission === "admins_only"}
            />
            <PreviewTile
              icon={<Type />}
              title={t("forum.sendSettings.previewText")}
              active={
                sendPermission !== "admins_only" &&
                !allowImages &&
                !allowVoice &&
                !allowFiles
              }
            />
            <PreviewTile
              icon={<ImageIcon />}
              title={t("forum.sendSettings.previewMedia")}
              active={
                sendPermission !== "admins_only" &&
                (allowImages || allowVoice || allowFiles)
              }
            />
          </div>
        </SectionCard>
      </div>
    </ForumShell>
  );
}

/** One of the three mobile states shown at the bottom of the design. */
function PreviewTile({
  icon,
  title,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  active: boolean;
}) {
  return (
    <div
      className={
        active
          ? "flex flex-col items-center gap-3 rounded-lg border border-primary bg-primary/10 p-4"
          : "flex flex-col items-center gap-3 rounded-lg border border-border bg-background/40 p-4 opacity-60"
      }
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary [&_svg]:size-5">
        {icon}
      </span>
      <span className="text-sm font-medium text-foreground">{title}</span>
      <div className="flex w-full flex-col gap-1.5">
        <span className="h-2 rounded bg-muted-foreground/25" />
        <span className="h-2 w-2/3 rounded bg-muted-foreground/20" />
      </div>
    </div>
  );
}
