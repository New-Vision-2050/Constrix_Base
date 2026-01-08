import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations, useLocale } from "next-intl";
import TheStatus from "../component/the-status";
import { NewsRow, TableConfigParams } from "../types";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CategoryTypes } from "../../categories/enums/Category-types";
import { EditIcon } from "lucide-react";

export const useNewsListTableConfig: (
  params?: TableConfigParams
) => TableConfig = (params) => {
  const { can } = usePermissions();
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
        render: (value: "active" | "inActive", row: NewsRow) => {
          const isActive = row.status == 1 ? true : false;
          return <TheStatus theStatus={isActive} id={row.id} />;
        },
      },
    ],
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: [],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    allSearchedFields: [
      {
        key: "category_website_cms_id",
        searchType: {
          type: "dropdown",
          placeholder: t("category"),
          dynamicDropdown: {
            url: `${baseURL}/categories-website/all?category_type=${CategoryTypes.NEWS_WEBSITE_TYPE}`,
            valueField: "id",
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 10,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
        },
      },
    ],
    executions: [
      (row) => (
        <DropdownMenuItem
          disabled={!can(PERMISSIONS.CMS.news.update)}
          onSelect={() => params?.onEdit?.(row.id)}
        >
          <div className="flex items-center justify-between w-full">
            <EditIcon size={16} />
            {t("editNews")}
          </div>
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.CMS.news.delete),
    },
    deleteUrl: `${baseURL}/website-news`,
  };
};
