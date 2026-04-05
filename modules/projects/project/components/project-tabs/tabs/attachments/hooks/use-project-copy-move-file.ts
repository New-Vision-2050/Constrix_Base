import { useMutation } from "@tanstack/react-query";
import {
  ProjectAttachmentsApi,
  type CopyMoveFileRequest,
} from "@/services/api/projects/project-attachments";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type UseProjectCopyMoveFileProps = {
  type: "copy" | "move";
  onSuccess?: () => void;
};

export default function useProjectCopyMoveFile({
  type,
  onSuccess,
}: UseProjectCopyMoveFileProps) {
  const t = useTranslations("docs-library.publicDocs.copyMoveDialog");

  return useMutation({
    mutationFn: (data: CopyMoveFileRequest) => {
      return type === "copy"
        ? ProjectAttachmentsApi.copyFiles(data)
        : ProjectAttachmentsApi.moveFiles(data);
    },
    onSuccess: () => {
      const message = type === "move" ? t("moveSuccess") : t("copySuccess");
      toast.success(message);
      onSuccess?.();
    },
    onError: () => {
      toast.error(t("moveCopeError"));
    },
  });
}
