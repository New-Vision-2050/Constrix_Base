"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useProjectAttachmentsCxt } from "../context/project-attachments-cxt";
import type { ProjectAttachmentRow } from "./types";
import { FileIcon } from "../components/table/FileIcon";
import ProjectAttachmentsStatusToggle from "../components/table/StatusToggle";
import { ProjectAttachmentsActionButtons } from "../components/table/ProjectAttachmentsActionButtons";

export function AttachmentCheckboxCell({ row }: { row: ProjectAttachmentRow }) {
  const { document } = row;
  const { toggleDocInSelectedDocs, selectedDocs } = useProjectAttachmentsCxt();
  const isDocSelected = useMemo(
    () => selectedDocs?.some((doc) => doc.id === document.id),
    [selectedDocs, document.id],
  );
  return (
    <Checkbox
      checked={isDocSelected}
      onCheckedChange={() => toggleDocInSelectedDocs(document)}
    />
  );
}

export function AttachmentNameCell({ row }: { row: ProjectAttachmentRow }) {
  const { document, isFolder } = row;
  const {
    setParentId,
    setTempParentId,
    setOpenDirWithPassword,
    setVisitedDirs,
    setDocToView,
  } = useProjectAttachmentsCxt();
  const handleClick = () => {
    if (document.status === 0) return;
    if (isFolder) {
      if (document?.is_password === 1) {
        setOpenDirWithPassword(true);
        setTempParentId(document.id);
      } else {
        setParentId(document.id);
        setVisitedDirs((prev) => [...prev, document]);
      }
    } else {
      setDocToView(document);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <FileIcon isFolder={isFolder} fileName={document.name} />
      <span
        onClick={handleClick}
        className="font-medium hover:underline cursor-pointer"
      >
        {document.name}
      </span>
    </div>
  );
}

export function AttachmentStatusCell({ row }: { row: ProjectAttachmentRow }) {
  const { document, isFolder } = row;
  const t = useTranslations("docs-library.publicDocs.table");
  const [rowStatus, setRowStatus] = useState(document.status);

  const changeStatusMutation = useMutation({
    mutationFn: async (checked: boolean) => {
      const _url = baseURL + `/files/${document?.id}/change-status`;
      return await apiClient.put(_url, {
        status: checked ? 1 : 0,
        type: isFolder ? "folder" : "file",
      });
    },
    onSuccess: () => {
      toast.success(t("statusChanged"));
    },
    onError: () => {
      toast.error(t("statusChangeFailed"));
    },
  });

  return (
    <ProjectAttachmentsStatusToggle
      isFolder={isFolder}
      onStatusChange={(checked) => changeStatusMutation.mutate(checked)}
      isPending={changeStatusMutation.isPending}
      rowStatus={rowStatus}
      setRowStatus={setRowStatus}
    />
  );
}

export function AttachmentActionsCell({ row }: { row: ProjectAttachmentRow }) {
  const { document, isFolder } = row;
  return (
    <ProjectAttachmentsActionButtons document={document} isFolder={isFolder} />
  );
}
