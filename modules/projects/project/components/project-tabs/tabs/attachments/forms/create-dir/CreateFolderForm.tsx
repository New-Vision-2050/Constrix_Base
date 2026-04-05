"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { serialize } from "object-to-formdata";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProjectAttachmentsCxt } from "../../context/project-attachments-cxt";
import type { DocumentT } from "../../types";
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { useQuery } from "@tanstack/react-query";

interface CreateFolderFormProps {
  onClose: () => void;
}

export default function CreateFolderForm({ onClose }: CreateFolderFormProps) {
  const t = useTranslations("docs-library.publicDocs.createNewDirDialog");
  const {
    refetchDocs,
    editedDoc,
    parentId,
    projectId,
    setEditedDoc,
    handleRefetchFoldersList,
    usersList,
  } = useProjectAttachmentsCxt();

  const userOptionsFallback =
    usersList?.map((u) => ({ value: String(u.id), label: u.name })) ?? [];

  const isEdit = Boolean(editedDoc);
  const folderUsersParent = parentId ?? projectId;

  const [name, setName] = useState(editedDoc?.name ?? "");
  const [password, setPassword] = useState("");
  const [accessType, setAccessType] = useState<"public" | "private">(
    (editedDoc?.access_type as "public" | "private") ?? "public",
  );
  const [userIds, setUserIds] = useState<string[]>(
    editedDoc?.users?.map((u) => String(u.id)) ?? [],
  );
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: folderUsersOptions } = useQuery({
    queryKey: ["project-attachment-folder-users", folderUsersParent, accessType],
    queryFn: async () => {
      if (accessType !== "private") return [];
      const res = await apiClient.get(
        `${baseURL}/folders/${folderUsersParent}/users`,
        { params: { page: 1, per_page: 100 } },
      );
      const payload = res.data?.payload ?? res.data?.data ?? [];
      return Array.isArray(payload)
        ? payload.map((u: { id: string; name: string }) => ({
            value: String(u.id),
            label: u.name,
          }))
        : [];
    },
    enabled: accessType === "private" && Boolean(folderUsersParent),
  });

  const options =
    folderUsersOptions?.length && folderUsersOptions.length > 0
      ? folderUsersOptions
      : userOptionsFallback;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name,
        parent_id: isEdit ? editedDoc?.parent_id : parentId ?? projectId,
        project_id: projectId,
        access_type: accessType,
        user_ids: accessType === "private" ? userIds : [],
      };
      if (password) body.password = password;
      if (file) body.file = file;

      const fd = serialize(body, { indices: true });

      if (isEdit && editedDoc) {
        await apiClient.put(`${baseURL}/folders/${editedDoc.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post(`${baseURL}/folders`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("تم الحفظ");
      setEditedDoc(undefined);
      onClose();
      refetchDocs();
      handleRefetchFoldersList();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message ?? "Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="folder-name">{t("name")}</Label>
        <Input
          id="folder-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="folder-password">{t("password")}</Label>
        <Input
          id="folder-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("permission")}</Label>
        <RadioGroup
          value={accessType}
          onValueChange={(v) => setAccessType(v as "public" | "private")}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="public" id="pub" />
            <Label htmlFor="pub">{t("public")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="private" id="priv" />
            <Label htmlFor="priv">{t("private")}</Label>
          </div>
        </RadioGroup>
      </div>

      {accessType === "private" && (
        <div className="space-y-2">
          <Label>{t("users")}</Label>
          <SearchableMultiSelect
            options={options}
            selectedValues={userIds}
            onChange={setUserIds}
            placeholder={t("usersPlaceholder")}
            className="w-full"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="folder-file">{t("file")}</Label>
        <Input
          id="folder-file"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onClose}>
          {t("cancelButtonText")}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "…" : t("submitButtonText")}
        </Button>
      </div>
    </form>
  );
}
