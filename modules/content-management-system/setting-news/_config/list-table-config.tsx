import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations, useLocale } from "next-intl";
import TheStatus from "../component/the-status";
import { NewsRow, TableConfigParams } from "../types";

export const useNewsListTableConfig: (
  params?: TableConfigParams
) => TableConfig = (params) => {
  const t = useTranslations("content-management-system.news.table");
  const locale = useLocale();

  return {
    tableId: "news-list-table",
    url: `${baseURL}/website-news`,
    columns: [
      {
        key: "title",
        label: t("title"),
        sortable: true,
        render: (_: unknown, row: NewsRow) => (
          <span className="font-medium">
            {locale === "ar"
              ? row.title_ar || row.title
              : row.title_en || row.title}
          </span>
        ),
      },
      {
        key: "content",
        label: t("content"),
        sortable: false,
        render: (_: unknown, row: NewsRow) => {
          const content =
            locale === "ar"
              ? row.content_ar || row.content
              : row.content_en || row.content;
          return (
            <span className="text-sm text-gray-400 line-clamp-2">
              {content?.substring(0, 50)}...
            </span>
          );
        },
      },
      {
        key: "category_website_cms_id",
        label: t("category"),
        sortable: true,
        render: (_: unknown, row: NewsRow) => (
          <span className="text-sm">{row.category.name || "-"}</span>
        ),
      },
      {
        key: "publish_date",
        label: t("publishDate"),
        sortable: true,
        render: (value: string) => (
          <span className="text-sm">{value || "-"}</span>
        ),
      },
      {
        key: "end_date",
        label: t("endDate"),
        sortable: true,
        render: (value: string) => (
          <span className="text-sm">{value || "-"}</span>
        ),
      },
      {
        key: "is_active",
        label: t("status"),
        render: (value: "active" | "inActive", row: NewsRow) => (
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onEdit?.(row.id)}>
          {t("editNews")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: true,
    },
    deleteUrl: `${baseURL}/website-news`,
    searchParamName: "search",
  };
};
