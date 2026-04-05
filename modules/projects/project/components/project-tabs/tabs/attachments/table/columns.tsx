import type { ColumnDef } from "@/components/headless/table";
import type { ProjectAttachmentRow } from "./types";
import {
  AttachmentActionsCell,
  AttachmentCheckboxCell,
  AttachmentNameCell,
  AttachmentStatusCell,
} from "./cells";

/**
 * Headless table columns (same shape as setting-founder/table-v2/columns).
 */
export function createColumns(
  t: (key: string) => string,
): ColumnDef<ProjectAttachmentRow>[] {
  return [
    {
      key: "select",
      name: "",
      sortable: false,
      render: (row) => <AttachmentCheckboxCell row={row} />,
    },
    {
      key: "name",
      name: t("doc_name"),
      sortable: false,
      render: (row) => <AttachmentNameCell row={row} />,
    },
    {
      key: "sortedBy",
      name: t("sortedBy"),
      sortable: false,
      render: (row) => (
        <span className="text-muted-foreground">
          {row.document?.last_log?.user?.name ?? "-"}
        </span>
      ),
    },
    {
      key: "fileSize",
      name: t("fileSize"),
      sortable: false,
      render: (row) => {
        const mb = (size?: number) => {
          if (!size) return "-";
          return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        };
        return (
          <span className="text-muted-foreground">
            {row.isFolder
              ? mb(row.document.size ?? 0)
              : mb(row.document?.file?.size ?? 0)}
          </span>
        );
      },
    },
    {
      key: "docsCount",
      name: t("docsCount"),
      sortable: false,
      render: (row) => (
        <span className="text-muted-foreground text-center block">
          {row.document?.files_count ?? "-"}
        </span>
      ),
    },
    {
      key: "lastActivity",
      name: t("lastActivity"),
      sortable: false,
      render: (row) => (
        <span className="text-muted-foreground text-sm">
          {row.document?.last_log?.title ?? "-"}
        </span>
      ),
    },
    {
      key: "status",
      name: t("status"),
      sortable: false,
      render: (row) => <AttachmentStatusCell row={row} />,
    },
    {
      key: "actions",
      name: t("settings"),
      sortable: false,
      render: (row) => <AttachmentActionsCell row={row} />,
    },
  ];
}
