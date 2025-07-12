import TableStatusSwitcher from "@/components/shared/table-status";
import { apiClient, baseURL } from "@/config/axios-config";


export const permissionsTableConfig = () => {
  return {
    url: `${baseURL}/role_and_permissions/permissions`,
    tableId: "permissions-table", 
    columns: [
      {
        key: "name",
        label: "اسم الصلاحية",
        sortable: true,
      },
      {
        key: "2",
        label: "فئة الصلاحية",
        sortable: true,
      },
    {
        key: "user_count",
        label: "عدد المستخدمين",
        sortable: true,
      },
      {
        key: "status",
        label: "الحالة",
        sortable: true,
        render: (_: unknown, row:any) => (
          <TableStatusSwitcher
            id={row.id}
            label={"نشط"}
            initialStatus={row.status == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(`/role_and_permissions/permissions/${row.id}/status`, {
                status: Number(isActive),
              });
            }}
            confirmDescription={(isActive) =>
              !isActive ? "تغير الحالة الى غير نشط" : "تغير الحالة الى نشط"
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
