"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/modules/table/components/ui/textarea";
import { useRouter } from "@i18n/navigation";
import { ROUTER } from "@/router";
import ImageField from "../../components/ui/ImageField";
import SwitchRow from "../../components/ui/SwitchRow";
import InfoNote from "../../components/ui/InfoNote";
import { readValidationErrors } from "../../api/client";
import { useCreateGroup, useUpdateGroup } from "../../hooks/use-groups";
import type { ForumGroup, GroupStatus } from "../../types";

/**
 * «بيانات المجموعة» — creates or edits a group, then jumps to its members
 * screen, which is where the design continues the flow.
 */
export default function GroupDataModal({
  open,
  forumId,
  group,
  onClose,
}: {
  open: boolean;
  forumId: string;
  /** `null` while creating. */
  group: ForumGroup | null;
  onClose: () => void;
}) {
  const t = useTranslations("Forums");
  const router = useRouter();

  const create = useCreateGroup(forumId);
  const update = useUpdateGroup(forumId);
  const pending = create.isPending || update.isPending;

  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [category, setCategory] = useState(group?.category ?? "");
  const [sortOrder, setSortOrder] = useState(
    group?.sort_order != null ? String(group.sort_order) : "",
  );
  const [showName, setShowName] = useState(group?.show_name_in_chat ?? true);
  const [status, setStatus] = useState<GroupStatus>(group?.status ?? "active");
  const [icon, setIcon] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const submit = () => {
    if (!name.trim()) {
      setErrors({ name: [t("common.requiredField")] });
      return;
    }
    setErrors({});

    const body = {
      name: name.trim(),
      description: description.trim() ? description.trim() : null,
      category: category.trim() ? category.trim() : null,
      show_name_in_chat: showName,
      status,
      sort_order: sortOrder.trim() ? Number(sortOrder) : null,
      icon,
    };

    const onError = (error: unknown) => {
      const fieldErrors = readValidationErrors(error);
      if (fieldErrors) setErrors(fieldErrors);
    };

    if (group) {
      update.mutate(
        { groupId: group.id, body },
        {
          onSuccess: () => {
            onClose();
            router.push(ROUTER.FORUM_GROUP_MEMBERS(forumId, group.id));
          },
          onError,
        },
      );
      return;
    }

    create.mutate(body, {
      onSuccess: (created) => {
        onClose();
        if (created?.id) {
          router.push(ROUTER.FORUM_GROUP_MEMBERS(forumId, created.id));
        }
      },
      onError,
    });
  };

  const error = create.error ?? update.error;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("forum.groupModal.title")}</DialogTitle>
          <DialogDescription>
            {t("forum.groupModal.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {error && !readValidationErrors(error) ? (
            <Alert severity="error">{t("common.saveFailed")}</Alert>
          ) : null}

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              {t("forum.groupModal.name")}
              <span className="text-destructive"> *</span>
            </Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.join(" ")}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              {t("forum.groupModal.description")}
            </Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            {errors.description ? (
              <p className="text-xs text-destructive">
                {errors.description.join(" ")}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                {t("forum.groupModal.category")}
              </Label>
              <Input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">
                {t("forum.groupModal.status")}
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as GroupStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    {t("status.groupActive")}
                  </SelectItem>
                  <SelectItem value="archived">
                    {t("status.groupArchived")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* The design shows a display-order field; the API accepts
              `sort_order` only when the backend starts persisting it. */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-muted-foreground">
              {t("forum.groupModal.sortOrder")}
            </Label>
            <Input
              type="number"
              min={1}
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            />
          </div>

          <ImageField
            label={t("forum.groupModal.icon")}
            hint={t("forum.groupModal.iconHint")}
            value={icon}
            previewUrl={group?.icon_url}
            onChange={setIcon}
          />

          <SwitchRow
            label={t("forum.groupModal.showName")}
            hint={t("forum.groupModal.showNameHint")}
            checked={showName}
            onChange={setShowName}
          />

          <InfoNote>{t("forum.groupModal.footerHint")}</InfoNote>
        </div>

        <DialogFooter className="gap-2 sm:justify-start">
          <Button onClick={submit} loading={pending}>
            {t("forum.groupModal.submit")}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
