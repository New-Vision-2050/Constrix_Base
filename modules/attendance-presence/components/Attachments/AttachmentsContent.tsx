"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Pencil, X, Upload, Eye, RefreshCw, UserCircle2, ChevronDown, ChevronUp, Camera, ImagePlus, IdCard, BriefcaseBusiness, ShieldCheck, MapPinned, HardHat, Copy } from "lucide-react";
import UploadProfileImageDialog from "@/components/shared/upload-profile-image";
import validateProfileImage from "@/modules/dashboard/api/validate-image";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAttendanceAttachments,
  updateAttendanceAttachment,
  updateIdentityDataAttachment,
  AttachmentMedia,
  AttendanceAttachmentsPayload,
  AttendanceDocuments,
} from "../../api/get-attendance-attachments";

const QUERY_KEY = "hr-attendance-attachments";

// ─── Types ───────────────────────────────────────────────────────────────────

type DocCardConfig = {
  /** field name in documents object (also used as the POST `key` value) */
  docKey: keyof Pick<
    AttendanceDocuments,
    "passport" | "identity" | "border_number" | "entry_number" | "work_permit" | "industrial_safety"
  >;
  startDateKey: keyof AttendanceDocuments;
  endDateKey: keyof AttendanceDocuments;
  filesKey: keyof AttendanceDocuments;
  /** array field name for POST e.g. "file_passport[]" */
  filePostKey: string;
  titleKey: "passport" | "identity" | "borderNumber" | "entryNumber" | "workPermit" | "industrialSafety";
  /** if true, the first uploaded image file is shown as a preview thumbnail */
  showImagePreview?: boolean;
  /** icon shown as placeholder when no image is uploaded */
  PlaceholderIcon?: React.ElementType;
  /**
   * entry_number & work_permit are owned by the identity-data resource
   * (User Profile > Iqama Data), so they must be saved through
   * /company-users/identity-data instead of /hr/attendance/attachments.
   */
  useIdentityDataEndpoint?: boolean;
};

// ─── Card configs (matches real API field names) ───────────────────────────────

const DOC_CARDS: DocCardConfig[] = [
  {
    docKey: "passport",
    startDateKey: "passport_start_date",
    endDateKey: "passport_end_date",
    filesKey: "file_passport",
    filePostKey: "file_passport[]",
    titleKey: "passport",
    showImagePreview: true,
    PlaceholderIcon: UserCircle2,
  },
  {
    docKey: "identity",
    startDateKey: "identity_start_date",
    endDateKey: "identity_end_date",
    filesKey: "file_identity",
    filePostKey: "file_identity[]",
    titleKey: "identity",
    showImagePreview: true,
    PlaceholderIcon: IdCard,
  },
  {
    docKey: "border_number",
    startDateKey: "border_number_start_date",
    endDateKey: "border_number_end_date",
    filesKey: "file_border_number",
    filePostKey: "file_border_number[]",
    titleKey: "borderNumber",
    showImagePreview: true,
    PlaceholderIcon: MapPinned,
  },
  {
    docKey: "entry_number",
    startDateKey: "entry_number_start_date",
    endDateKey: "entry_number_end_date",
    filesKey: "file_entry_number",
    filePostKey: "file_entry_number[]",
    titleKey: "entryNumber",
    showImagePreview: true,
    PlaceholderIcon: ShieldCheck,
    useIdentityDataEndpoint: true,
  },
  {
    docKey: "work_permit",
    startDateKey: "work_permit_start_date",
    endDateKey: "work_permit_end_date",
    filesKey: "file_work_permit",
    filePostKey: "file_work_permit[]",
    titleKey: "workPermit",
    showImagePreview: true,
    PlaceholderIcon: BriefcaseBusiness,
    useIdentityDataEndpoint: true,
  },
  {
    docKey: "industrial_safety",
    startDateKey: "industrial_safety_start_date",
    endDateKey: "industrial_safety_end_date",
    filesKey: "file_industrial_safety",
    filePostKey: "file_industrial_safety[]",
    titleKey: "industrialSafety",
    showImagePreview: true,
    PlaceholderIcon: HardHat,
  },
];

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <Card className="bg-sidebar border-sidebar-border">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-24 mt-2" />
      </CardContent>
    </Card>
  );
}

// ─── File preview row ─────────────────────────────────────────────────────────

function FileRow({ file }: { file: AttachmentMedia }) {
  const t = useTranslations("AttendancePresence.attachmentsTab");
  return (
    <div className="flex items-center gap-2 py-1 px-2 rounded-md bg-sidebar-accent/30 text-sm">
      <span className="flex-1 truncate text-sidebar-foreground">
        {file.name ?? file.url.split("/").pop()}
      </span>
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 flex-shrink-0"
        title={t("viewFile")}
      >
        <Eye className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

// ─── Document attachment card ─────────────────────────────────────────────────

function DocumentCard({
  config,
  documents,
  onUpdated,
  onRefetch,
}: {
  config: DocCardConfig;
  documents: AttendanceDocuments;
  onUpdated: (docs: AttendanceDocuments) => void;
  onRefetch: () => void;
}) {
  const t = useTranslations("AttendancePresence.attachmentsTab");
  const tUpload = useTranslations("UserProfile.header.uploadPhoto");

  const docNumber = documents[config.docKey] as string | null;
  const startDate = documents[config.startDateKey] as string | null;
  const endDate = documents[config.endDateKey] as string | null;
  const files = (documents[config.filesKey] as AttachmentMedia[]) ?? [];

  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [numVal, setNumVal] = useState(docNumber ?? "");
  const [startVal, setStartVal] = useState(startDate ?? "");
  const [endVal, setEndVal] = useState(endDate ?? "");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newFilePreviewUrl, setNewFilePreviewUrl] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const handleImageDialogValidate = async (file: File) => {
    const isImage = ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type);
    return [
      {
        sentence: "Only image files (JPG, JPEG, PNG, WEBP) are allowed.",
        status: isImage ? 1 : 0,
        sub_title: "",
      },
    ];
  };

  const handleImageDialogUpload = async (file: File) => {
    setNewFile(file);
    if (!expanded) setExpanded(true);
    if (!editing) setEditing(true);
    return { image_url: URL.createObjectURL(file) };
  };

  React.useEffect(() => {
    if (!newFile || !newFile.type.startsWith("image/")) { setNewFilePreviewUrl(null); return; }
    const url = URL.createObjectURL(newFile);
    setNewFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [newFile]);

  const previewImages = config.showImagePreview
    ? files.filter((f) => f.type === "image")
    : [];

  // Sync fields if parent data changes (e.g. after another card saves)
  React.useEffect(() => {
    if (!editing) {
      setNumVal((documents[config.docKey] as string | null) ?? "");
      setStartVal((documents[config.startDateKey] as string | null) ?? "");
      setEndVal((documents[config.endDateKey] as string | null) ?? "");
    }
  }, [documents, config, editing]);

  const mutation = useMutation({
    mutationFn: (fd: FormData) =>
      config.useIdentityDataEndpoint
        ? updateIdentityDataAttachment(fd).then(() => null)
        : updateAttendanceAttachment(fd),
    onSuccess: (res) => {
      toast.success(t("saveSuccess"));
      setEditing(false);
      setNewFile(null);
      if (res?.documents) {
        onUpdated(res.documents);
      } else {
        onRefetch();
      }
    },
    onError: (error: unknown) => {
      console.error(`[${config.docKey}] save failed:`, error);
      const err = error as {
        response?: {
          data?: {
            message?: string | { description?: string };
            errors?: Record<string, string[]>;
          };
        };
      };
      const apiData = err?.response?.data;
      const firstFieldError = apiData?.errors
        ? Object.values(apiData.errors).flat()[0]
        : undefined;
      const rawMessage = apiData?.message;
      const backendMessage =
        typeof rawMessage === "string" ? rawMessage : rawMessage?.description;
      toast.error(firstFieldError || backendMessage || t("saveError"));
    },
  });

  const handleSave = () => {
    const fd = new FormData();
    if (!config.useIdentityDataEndpoint) {
      fd.append("key", config.docKey);
    }
    fd.append(config.docKey, numVal);
    fd.append(config.startDateKey as string, startVal);
    fd.append(config.endDateKey as string, endVal);
    if (newFile) fd.append(config.filePostKey, newFile);
    mutation.mutate(fd);
  };

  const handleCancel = () => {
    setNumVal(docNumber ?? "");
    setStartVal(startDate ?? "");
    setEndVal(endDate ?? "");
    setNewFile(null);
    setEditing(false);
  };

  const handleCopyDocNumber = () => {
    if (!docNumber) return;
    navigator.clipboard.writeText(docNumber);
    toast.success(t("copySuccess"));
  };

  return (
    <Card className="bg-sidebar border-sidebar-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-sidebar-foreground">
          {t(config.titleKey)}
        </CardTitle>
        <div className="flex items-center gap-1">
          {/* Camera button — always visible for showImagePreview cards */}
          {config.showImagePreview && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:bg-primary/10 hover:text-primary"
              onClick={() => setImageDialogOpen(true)}
              disabled={mutation.isPending}
              title={t("uploadFile")}
            >
              <Camera className="h-3.5 w-3.5" />
            </Button>
          )}
          {/* Toggle expand/collapse */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            onClick={() => {
              if (expanded && editing) handleCancel();
              setExpanded((v) => !v);
            }}
            disabled={mutation.isPending}
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
          {/* Edit / Cancel — only visible when expanded */}
          {expanded && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary hover:bg-primary/10"
              onClick={() => (editing ? handleCancel() : setEditing(true))}
              disabled={mutation.isPending}
            >
              {editing ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Work permit background image — always visible */}
        {config.showImagePreview && (() => {
          const bgUrl = editing && newFilePreviewUrl
            ? newFilePreviewUrl
            : previewImages[0]?.url ?? null;
          return (
            <div className="relative w-full h-40 rounded-md overflow-hidden border border-sidebar-border bg-sidebar-accent/50 flex items-center justify-center">
              {bgUrl ? (
                <Image
                  src={bgUrl}
                  alt={t(config.titleKey)}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setImageDialogOpen(true)}
                  className="flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors cursor-pointer w-full h-full"
                >
                  {config.PlaceholderIcon
                    ? <config.PlaceholderIcon className="w-14 h-14 opacity-20" />
                    : <ImagePlus className="w-14 h-14 opacity-20" />
                  }
                  <span className="text-xs opacity-50">{t("uploadFile")}</span>
                </button>
              )}
            </div>
          );
        })()}

        {/* Collapsible details */}
        {expanded && (
          <>
            {/* Document number */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">{t("documentNumber")}</Label>
              {editing ? (
                <Input
                  value={numVal}
                  onChange={(e) => setNumVal(e.target.value)}
                  className="h-8 text-sm bg-sidebar border-sidebar-border"
                  disabled={mutation.isPending}
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <p className="text-sm text-sidebar-foreground font-medium">
                    {docNumber || <span className="text-muted-foreground">—</span>}
                  </p>
                  {docNumber && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      onClick={handleCopyDocNumber}
                      title={t("copyDocumentNumber")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Start date */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">{t("startDate")}</Label>
              {editing ? (
                <Input
                  type="date"
                  value={startVal}
                  onChange={(e) => setStartVal(e.target.value)}
                  className="h-8 text-sm bg-sidebar border-sidebar-border"
                  disabled={mutation.isPending}
                />
              ) : (
                <p className="text-sm text-sidebar-foreground">
                  {startDate || <span className="text-muted-foreground">—</span>}
                </p>
              )}
            </div>

            {/* End date */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">{t("endDate")}</Label>
              {editing ? (
                <Input
                  type="date"
                  value={endVal}
                  onChange={(e) => setEndVal(e.target.value)}
                  className="h-8 text-sm bg-sidebar border-sidebar-border"
                  disabled={mutation.isPending}
                />
              ) : (
                <p className="text-sm text-sidebar-foreground">
                  {endDate || <span className="text-muted-foreground">—</span>}
                </p>
              )}
            </div>

            {/* Uploaded files */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                {files.length > 0 ? t("filesUploaded", { count: files.length }) : t("noFile")}
              </Label>
              {files.length > 0 && (
                <div className="space-y-1">
                  {files.map((f) => (
                    <FileRow key={f.id} file={f} />
                  ))}
                </div>
              )}
            </div>

            {/* File picker — only in edit mode */}
            {editing && (
              <div className="space-y-1 pt-1">
                {newFile ? (
                  <div className="flex items-center gap-2 p-2 bg-sidebar border border-sidebar-border rounded-md text-sm">
                    <span className="flex-1 truncate text-sidebar-foreground">{newFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => setNewFile(null)}
                      disabled={mutation.isPending}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-primary border text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={() => setImageDialogOpen(true)}
                    disabled={mutation.isPending}
                  >
                    {files.length > 0 ? (
                      <><RefreshCw className="h-3.5 w-3.5 mr-1" />{t("replaceFile")}</>
                    ) : (
                      <><Upload className="h-3.5 w-3.5 mr-1" />{t("uploadFile")}</>
                    )}
                  </Button>
                )}
              </div>
            )}

            {/* Save / Cancel */}
            {editing && (
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleSave}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? t("saving") : t("saveDocument")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-sidebar-border"
                  onClick={handleCancel}
                  disabled={mutation.isPending}
                >
                  {t("cancelEdit")}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Reuse the existing profile image dialog (crop + validation) */}
      {config.showImagePreview && (
        <UploadProfileImageDialog
          title={tUpload("title")}
          open={imageDialogOpen}
          setOpen={setImageDialogOpen}
          validateImageFn={handleImageDialogValidate}
          uploadImageFn={handleImageDialogUpload}
          onSuccess={() => setImageDialogOpen(false)}
        />
      )}
    </Card>
  );
}

// ─── Profile photo card ────────────────────────────────────────────────────────

function ProfilePhotoCard({
  imageUrl,
  onUpdated,
}: {
  imageUrl: string | null;
  onUpdated: (url: string) => void;
}) {
  const t = useTranslations("AttendancePresence.attachmentsTab");
  const tUpload = useTranslations("UserProfile.header.uploadPhoto");
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [localUrl, setLocalUrl] = useState<string | null>(imageUrl);

  React.useEffect(() => {
    setLocalUrl(imageUrl);
  }, [imageUrl]);

  // Upload via HR attendance endpoint, return { image_url } shape the dialog expects
  const uploadImageFn = async (file: File): Promise<{ image_url: string }> => {
    const fd = new FormData();
    fd.append("key", "profile");
    fd.append("image", file);
    const res = await updateAttendanceAttachment(fd);
    const url = res?.profile?.image_url ?? "";
    return { image_url: url };
  };

  const handleSuccess = (url: string) => {
    setLocalUrl(url);
    onUpdated(url);
    setOpen(false);
    toast.success(t("saveSuccess"));
  };

  return (
    <Card className="bg-sidebar border-sidebar-border">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold text-sidebar-foreground">
          {t("profilePhoto")}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-primary hover:bg-primary/10"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-3">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-sidebar-border bg-sidebar-accent flex items-center justify-center">
          {localUrl ? (
            <Image
              src={localUrl}
              alt={t("profilePhotoLabel")}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <UserCircle2 className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="border-primary border text-primary hover:bg-primary/10 hover:text-primary"
          onClick={() => setOpen(true)}
        >
          <Upload className="h-3.5 w-3.5 mr-1" />
          {t("changePhoto")}
        </Button>
      </CardContent>

      {/* Reuse the existing profile image dialog (crop + validation) */}
      <UploadProfileImageDialog
        title={tUpload("title")}
        open={open}
        setOpen={setOpen}
        validateImageFn={(file) => validateProfileImage(file, user?.id ?? "")}
        uploadImageFn={uploadImageFn}
        onSuccess={handleSuccess}
      />
    </Card>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AttachmentsContent() {
  const t = useTranslations("AttendancePresence");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAttendanceAttachments,
  });

  // Local state so cards update immediately without a full refetch
  const [localData, setLocalData] = useState<AttendanceAttachmentsPayload | null>(null);

  React.useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  const handleDocumentsUpdated = (docs: AttendanceDocuments) => {
    setLocalData((prev) =>
      prev ? { ...prev, documents: docs } : prev
    );
  };

  const handlePhotoUpdated = (url: string) => {
    setLocalData((prev) =>
      prev ? { ...prev, profile: { image_url: url } } : prev
    );
  };

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError || !localData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-muted-foreground">
        <p>{t("loadError")}</p>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          {tCommon("states.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Profile Photo */}
      <ProfilePhotoCard
        imageUrl={localData.profile?.image_url ?? null}
        onUpdated={handlePhotoUpdated}
      />

      {/* 2–6. Document cards */}
      {DOC_CARDS.map((config) => (
        <DocumentCard
          key={config.docKey}
          config={config}
          documents={localData.documents}
          onUpdated={handleDocumentsUpdated}
          onRefetch={refetch}
        />
      ))}
    </div>
  );
}
