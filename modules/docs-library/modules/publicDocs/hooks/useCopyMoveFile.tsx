import { useMutation } from "@tanstack/react-query";
import { copyFile, moveFile, CopyMoveFileRequest } from "../apis/copy-move-file";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

type UseCopyMoveFileProps = {
  type: "copy" | "move";
  onSuccess?: () => void;
};

export default function useCopyMoveFile({ type, onSuccess }: UseCopyMoveFileProps) {
  const t = useTranslations("docs-library.publicDocs.copyMoveDialog");

  return useMutation({
    mutationFn: (data: CopyMoveFileRequest) => {
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
