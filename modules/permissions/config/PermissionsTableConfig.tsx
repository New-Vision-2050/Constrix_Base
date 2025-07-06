import TableStatusSwitcher from "@/components/shared/table-status";
import { apiClient, baseURL } from "@/config/axios-config";


export const permissionsTableConfig = () => {
  return {
    url: `${baseURL}/write-url`,
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
        key: "3",
        label: "عدد المستخدمين",
        sortable: true,
      },
      {
        key: "is_active",
        label: "الحالة",
        sortable: true,
        render: (_: unknown, row:any) => (
          <TableStatusSwitcher
            id={row.id}
            label={"نشط"}
            initialStatus={row.is_active == 1}
            confirmAction={async (isActive) => {
              return await apiClient.put(`/write-url/${row.id}/status`, {
                is_active: Number(isActive),
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
    searchParamName: "q",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    // deleteUrl: `${baseURL}/company-users`,
    executionConfig: {
      canEdit: true,
      canDelete: true,
    },
  };
};
