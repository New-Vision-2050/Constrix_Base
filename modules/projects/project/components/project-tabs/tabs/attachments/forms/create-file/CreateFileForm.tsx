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
import { SearchableMultiSelect } from "@/components/shared/searchable-multi-select";
import { useQuery } from "@tanstack/react-query";

interface CreateFileFormProps {
  onClose: () => void;
}

export default function CreateFileForm({ onClose }: CreateFileFormProps) {
  const t = useTranslations("docs-library.publicDocs.createNewFileDialog");
  const {
    refetchDocs,
    editedDoc,
    parentId,
    projectId,
    handleRefetchDocsWidgets,
  } = useProjectAttachmentsCxt();

  const isEdit = Boolean(editedDoc);
  const folderUsersParent = parentId ?? projectId;

  const [name, setName] = useState(editedDoc?.name ?? "");
  const [referenceNumber, setReferenceNumber] = useState(
    editedDoc?.reference_number ?? "",
  );
  const [password, setPassword] = useState("");
  const [startDate, setStartDate] = useState(
    editedDoc?.start_date
      ? editedDoc.start_date.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [endDate, setEndDate] = useState(
    editedDoc?.end_date
      ? editedDoc.end_date.slice(0, 10)
      : new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const [accessType, setAccessType] = useState<"public" | "private">(
    (editedDoc?.access_type as "public" | "private") ?? "public",
  );
  const [userIds, setUserIds] = useState<string[]>(
    editedDoc?.users?.map((u) => String(u.id)) ?? [],
  );
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: folderUsersOptions } = useQuery({
    queryKey: ["project-attachment-file-users", folderUsersParent, accessType],
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

  const options = folderUsersOptions ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && !file) {
      toast.error("يرجى ارفاق ملف");
      return;
    }
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        name,
        reference_number: referenceNumber,
        parent_id: isEdit ? editedDoc?.parent_id : parentId ?? projectId,
        project_id: projectId,
        access_type: accessType,
        user_ids: accessType === "private" ? userIds : [],
        start_date: startDate,
        end_date: endDate,
      };
      if (password) body.password = password;
      if (file) body.file = file;

      const fd = serialize(body, { indices: true });

      if (isEdit && editedDoc) {
        await apiClient.put(`${baseURL}/files/${editedDoc.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await apiClient.post(`${baseURL}/files`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("تم الحفظ");
      onClose();
      handleRefetchDocsWidgets();
      refetchDocs();
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
        <Label htmlFor="file-name">{t("name")}</Label>
        <Input
          id="file-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ref">{t("reference_number")}</Label>
        <Input
          id="ref"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder={t("reference_numberPlaceholder")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-password">{t("password")}</Label>
        <Input
          id="file-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">{t("createdAt")}</Label>
          <Input
            id="start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end">{t("endDate")}</Label>
          <Input
            id="end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("permission")}</Label>
        <RadioGroup
          value={accessType}
          onValueChange={(v) => setAccessType(v as "public" | "private")}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="public" id="f-pub" />
            <Label htmlFor="f-pub">{t("public")}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="private" id="f-priv" />
            <Label htmlFor="f-priv">{t("private")}</Label>
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
        <Label htmlFor="doc-file">{t("file")}</Label>
        <Input
          id="doc-file"
          type="file"
          accept="application/pdf,application/msword,image/jpeg,image/png"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required={!isEdit}
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
