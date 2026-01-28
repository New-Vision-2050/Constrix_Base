import TableStatusSwitcher from "@/components/shared/table-status";
import { apiClient, baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";

export const permissionsTableConfig: (t: any) => TableConfig = (t) => {
  return {
    url: `${baseURL}/role_and_permissions/permissions`,
    tableId: "permissions-table",
    columns: [
      {
        key: "name",
        label: t("header.permissions.name"),
        sortable: true,
      },
      {
        key: "2",
        label: t("header.permissions.category"),
        sortable: true,
      },
      {
        key: "user_count",
        label: t("header.permissions.userCount"),
        sortable: true,
      },
      {
        key: "status",
        label: t("header.permissions.status"),
        sortable: true,
        render: (_: unknown, row: any) => (
          <TableStatusSwitcher
            id={row.id}
            label={t("header.permissions.active")}
            initialStatus={row.status == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(
                `/role_and_permissions/permissions/${row.id}/status`,
                {
                  status: Number(isActive),
                }
              );
            }}
            confirmDescription={(isActive) =>
              !isActive ? t("header.permissions.deactivate") : t("header.permissions.activate")
            }
            showDatePicker={() => false}
          />
        ),
      },
    ],
    defaultSortColumn: "id",
    defaultSortDirection: "asc" as const,
    enableSorting: true,
    enablePagination: true,
    defaultItemsPerPage: 5,
    enableSearch: true,
    enableColumnSearch: true,
    searchFields: ["name", "email"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    deleteUrl: `${baseURL}/role_and_permissions/permissions`,
    executionConfig: {
      canEdit: false,
      canDelete: false,
    },
  };
};
