import TableStatusSwitcher from "@/components/shared/table-status";
import { apiClient, baseURL } from "@/config/axios-config";

export const rolesTableConfig = () => {
  return {
    url: `${baseURL}/write-url`,
    tableId: "roles-table",
    columns: [
      {
        key: "name",
        label: "اسم الدور",
        sortable: true,
      },
      {
        key: "1",
        label: "عدد البرامج",
        sortable: true,
      },
      {
        key: "2",
        label: "عدد الصلاحيات",
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
        render: (_: unknown, row: any) => (
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
    allSearchedFields: [
      {
        key: "roleName",
        searchType: {
          type: "dropdown",
          placeholder: "اسم الدور",
          dynamicDropdown: {
            url: `${baseURL}/write-url`,
            valueField: "id",
            labelField: "name",
            paginationEnabled: true,
            itemsPerPage: 5,
            searchParam: "name",
            pageParam: "page",
            limitParam: "per_page",
            totalCountHeader: "x-total-count",
          },
        },
      },
      {
        key: "employeeName",
        searchType: {
          type: "text",
          placeholder: "اسم الموظف",
        },
      },
      {
        key: "status",
        searchType: {
          type: "dropdown",
          placeholder: "حالة الدور",
          dropdownOptions: [
            {
              value: "active",
              label: "نشط",
            },
            {
              value: "inactive",
              label: "غير نشط",
            },
          ],
        },
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
