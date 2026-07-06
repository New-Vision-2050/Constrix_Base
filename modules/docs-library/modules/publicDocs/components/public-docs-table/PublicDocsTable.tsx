import React, { useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { usePublicDocsCxt } from "../../contexts/public-docs-cxt";
import { DocumentT } from "../../types/Directory";
import { FileIcon } from "./components/FileIcon";
import StatusToggle from "./components/StatusToggle";
import { ActionButtons } from "./components/ActionButtons";
import { apiClient, baseURL } from "@/config/axios-config";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useOptionalDocsLibraryCxt } from "@/modules/docs-library/context/docs-library-cxt";

type DocRow = {
  document: DocumentT;
  isFolder: boolean;
};

const DocsTableLayout = HeadlessTableLayout<DocRow>("public-docs");

/**
 * Main public documents table component
 * Displays documents in a structured table format using HeadlessTableLayout
 */
export const PublicDocsTable = () => {
  const {
    docs,
    isLoadingDocs,
    docsPagination,
    setPage,
    setLimit,
    projectId,
    setParentId,
    setTempParentId,
    setOpenDirWithPassword,
    setVisitedDirs,
    setDocToView,
  } = usePublicDocsCxt();
  const docsLibrary = useOptionalDocsLibraryCxt();
  const t = useTranslations("docs-library.publicDocs.table");

  const params = DocsTableLayout.useTableParams({
    initialPage: docsPagination?.current_page ?? 1,
    initialLimit: docsPagination?.per_page ?? 10,
  });

  const currentPage = docsPagination?.current_page ?? 1;
  // Sync external pagination with params
  useEffect(() => {
    params.setPage(currentPage);
  }, [currentPage, params]);

  const allRows: DocRow[] = useMemo(() => {
    const folders = (docs?.folders || []).map((doc) => ({
      document: doc,
      isFolder: true,
    }));
    const files = (docs?.files || []).map((doc) => ({
      document: doc,
      isFolder: false,
    }));
    return [...folders, ...files];
  }, [docs]);

  const handleRowClick = useCallback(
    (row: DocRow) => {
      if (row.document.status == 0) return;
      if (row.isFolder) {
        if (row.document?.is_password == 1) {
          setOpenDirWithPassword(true);
          setTempParentId(row.document.id);
        } else {
          setParentId(row.document.id);
          if (!projectId) {
            docsLibrary?.handleChangeParentId(row.document.id);
          }
          setVisitedDirs((prev) => [...prev, row.document]);
        }
      } else {
        setDocToView(row.document);
      }
    },
    [
      projectId,
      setParentId,
      setTempParentId,
      setOpenDirWithPassword,
      setVisitedDirs,
      setDocToView,
      docsLibrary,
    ],
  );

  const formatFileSize = (size?: number) => {
    if (!size) return "-";
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const columns = useMemo(
    () => [
      {
        key: "name",
        name: t("doc_name"),
        sortable: false,
        render: (row: DocRow) => (
          <div className="flex items-center gap-3">
            <FileIcon isFolder={row.isFolder} fileName={row.document.name} />
            <span
              onClick={() => handleRowClick(row)}
              className="font-medium hover:underline cursor-pointer"
            >
              {row.document.name}
            </span>
          </div>
        ),
      },
      {
        key: "company_name",
        name: t("companyName"),
        sortable: false,
        render: (row: DocRow) => (
          <span className="text-muted-foreground">
            {row.document.company_name?.trim() || "-"}
          </span>
        ),
      },
      {
        key: "sortedBy",
        name: t("sortedBy"),
        sortable: false,
        render: (row: DocRow) => (
          <span className="text-muted-foreground">
            {row.document?.last_log?.user?.name ?? "-"}
          </span>
        ),
      },
      {
        key: "fileSize",
        name: t("fileSize"),
        sortable: false,
        render: (row: DocRow) => (
          <span className="text-muted-foreground">
            {row.isFolder
              ? formatFileSize(row.document.size ?? 0)
              : formatFileSize(row.document?.file?.size ?? 0)}
          </span>
        ),
      },
      {
        key: "docsCount",
        name: t("docsCount"),
        sortable: false,
        render: (row: DocRow) => (
          <span className="text-muted-foreground text-center">
            {row.document?.files_count ?? "-"}
          </span>
        ),
      },
      {
        key: "lastActivity",
        name: t("lastActivity"),
        sortable: false,
        render: (row: DocRow) => (
          <span className="text-muted-foreground text-sm">
            {row.document?.last_log?.title ?? "-"}
          </span>
        ),
      },
      {
        key: "status",
        name: t("status"),
        sortable: false,
        render: (row: DocRow) => (
          <StatusToggleCell document={row.document} isFolder={row.isFolder} />
        ),
      },
      {
        key: "actions",
        name: t("settings"),
        sortable: false,
        render: (row: DocRow) => (
          <ActionButtons document={row.document} isFolder={row.isFolder} />
        ),
      },
    ],
    [t, handleRowClick],
  );

  const totalPages = docsPagination?.last_page ?? 1;
  const totalItems = docsPagination?.total ?? allRows.length;

  const state = DocsTableLayout.useTableState({
    data: allRows,
    columns,
    totalPages,
    totalItems,
    params: {
      ...params,
      setPage: (page: number) => {
        params.setPage(page);
        setPage(page);
      },
      setLimit: (limit: number) => {
        params.setLimit(limit);
        setLimit(limit);
      },
    },
    selectable: false,
    getRowId: (row) => row.document.id,
    loading: isLoadingDocs,
    searchable: false,
  });

  return (
    <DocsTableLayout
      table={
        <DocsTableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
      }
      pagination={<DocsTableLayout.Pagination state={state} />}
    />
  );
};

/**
 * Status toggle cell - wraps status mutation logic per row
 */
function StatusToggleCell({
  document,
  isFolder,
}: {
  document: DocumentT;
  isFolder: boolean;
}) {
  const t = useTranslations("docs-library.publicDocs.table");
  const [rowStatus, setRowStatus] = React.useState(document.status);

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
    <StatusToggle
      isFolder={isFolder}
      onStatusChange={(checked) => changeStatusMutation.mutate(checked)}
      isPending={changeStatusMutation.isPending}
      rowStatus={rowStatus}
      setRowStatus={setRowStatus}
    />
  );
}
