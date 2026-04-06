import { useMutation } from "@tanstack/react-query";
import {
  copyFile,
  moveFile,
  CopyMoveFileRequest,
} from "../apis/copy-move-file";
import { ProjectAttachmentsApi } from "@/services/api/projects/project-attachments";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type UseCopyMoveFileProps = {
  type: "copy" | "move";
  onSuccess?: () => void;
  /** When set, uses project attachment copy/move endpoints. */
  projectId?: string;
};

export default function useCopyMoveFile({
  type,
  onSuccess,
  projectId,
}: UseCopyMoveFileProps) {
  const t = useTranslations("docs-library.publicDocs.copyMoveDialog");

  return useMutation({
    mutationFn: (data: CopyMoveFileRequest) => {
      if (projectId) {
        return type === "copy"
          ? ProjectAttachmentsApi.copyFiles(data)
          : ProjectAttachmentsApi.moveFiles(data);
      }
      return type === "copy" ? copyFile(data) : moveFile(data);
    },
    onSuccess: (data) => {
      const message = type === "move" ? t("moveSuccess") : t("copySuccess");
      toast.success(message);
      onSuccess?.();
    },
    onError: (error) => {
      console.error("Copy/Move error:", error);
      toast.error(t("moveCopeError"));
    },
  });
}
