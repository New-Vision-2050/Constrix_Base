import { DocumentT } from "../../../types/Directory";
import { Checkbox } from "@/components/ui/checkbox";
import { FileIcon } from "./FileIcon";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";
import ToggleControl from "@/modules/clients/components/ToggleControl";
import { useTranslations } from "next-intl";
import { usePublicDocsCxt } from "../../../contexts/public-docs-cxt";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

/**
 * Table row component for displaying document information
 * Renders a single document row with all relevant data
 */
interface TableRowProps {
  document: DocumentT;
  isFolder?: boolean;
}

export const TableRow = ({ document, isFolder = false }: TableRowProps) => {
  const {
    setParentId,
    setTempParentId,
    setOpenDirWithPassword,
    toggleDocInSelectedDocs,
    setVisitedDirs,
    setDocToView,
  } = usePublicDocsCxt();
  const { can } = usePermissions();
  const t = useTranslations("docs-library.publicDocs.table");
  const formatFileSize = (size?: number) => {
    if (!size) return "-";
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleClick = () => {
    if (isFolder) {
      if (document?.is_password == 1) {
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

  // Mutation for changing document status
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
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <Checkbox onCheckedChange={() => toggleDocInSelectedDocs(document)} />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <FileIcon isFolder={isFolder} fileName={document.name} />
          <span
            onClick={handleClick}
            className={`font-medium hover:underline cursor-pointer`}
          >
            {document.name}
          </span>
        </div>
      </td>

      <td className="px-4 py-3 text-muted-foreground">
        {document?.last_log?.user?.name ?? "-"}
      </td>

      <td className="px-4 py-3 text-muted-foreground">
        {isFolder
          ? formatFileSize(document.size ?? 0)
          : formatFileSize(document?.file?.size ?? 0)}
      </td>

      <td className="px-4 py-3 text-muted-foreground text-center">
        {document?.files_count ?? "-"}
      </td>

      <td className="px-4 py-3 text-muted-foreground text-sm">
        {document?.last_log?.title ?? "-"}
      </td>

      <td className="px-4 py-3">
        {(
          isFolder
            ? !can(PERMISSIONS.library.folder.activate)
            : !can(PERMISSIONS.library.file.activate)
        ) ? (
          <div className="w-full h-full bg-muted/30">
            {document.status == 1 ? t("active") : t("inactive")}
          </div>
        ) : (
          <ToggleControl
            activeLabel={t("active")}
            inactiveLabel={t("inactive")}
            checked={document.status == 1 ? true : false}
            onChange={(checked) => changeStatusMutation.mutate(checked)}
            disabled={
              changeStatusMutation.isPending ||
              (isFolder
                ? !can(PERMISSIONS.library.folder.activate)
                : !can(PERMISSIONS.library.file.activate))
            }
          />
        )}
      </td>

      <td className="px-4 py-3">
        <ActionButtons document={document} />
      </td>
    </tr>
  );
};
