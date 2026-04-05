"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ProjectAttachmentsTableLayout } from "../../table/layout";
import { createColumns } from "../../table/columns";
import { useProjectAttachmentsCxt } from "../../context/project-attachments-cxt";
import type { ProjectAttachmentRow } from "../../table/types";

export default function ProjectAttachmentsHeadlessTable() {
  const t = useTranslations("docs-library.publicDocs.table");
  const {
    docs,
    docsPagination,
    isLoadingDocs,
    tableParams,
  } = useProjectAttachmentsCxt();

  const rows = useMemo<ProjectAttachmentRow[]>(() => {
    const folders = (docs?.folders ?? []).map((d) => ({
      document: d,
      isFolder: true,
    }));
    const files = (docs?.files ?? []).map((d) => ({
      document: d,
      isFolder: false,
    }));
    return [...folders, ...files];
  }, [docs]);

  const columns = useMemo(() => createColumns(t), [t]);

  const state = ProjectAttachmentsTableLayout.useTableState({
    data: rows,
    columns,
    totalPages: docsPagination?.last_page ?? 1,
    totalItems: docsPagination?.total ?? 0,
    params: tableParams,
    getRowId: (row) => row.document.id,
    loading: isLoadingDocs,
    searchable: true,
    filtered: Boolean(tableParams.search?.length),
  });

  return (
    <div className="bg-sidebar rounded-lg overflow-hidden">
      <ProjectAttachmentsTableLayout
        table={
          <ProjectAttachmentsTableLayout.Table
            state={state}
            loadingOptions={{ rows: 5 }}
          />
        }
        pagination={<ProjectAttachmentsTableLayout.Pagination state={state} />}
      />
    </div>
  );
}
