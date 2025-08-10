import TableStatusSwitcher from "@/components/shared/table-status";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Edit } from "lucide-react";

export const rolesTableConfig = ({handleOpenRolesSheet}:{
  handleOpenRolesSheet:({ isEdit, selectedId }: { isEdit: boolean; selectedId?: string })=>void;
}) => {
  return {
    url: `${baseURL}/role_and_permissions/roles`,
    tableId: "roles-table",
    columns: [
      {
        key: "name",
        label: "اسم الدور",
        sortable: true,
      },
      {
        key: "programs_count",
        label: "عدد البرامج",
        sortable: true,
      },
      {
        key: "permission_count",
        label: "عدد الصلاحيات",
        sortable: true,
      },
      {
        key: "users_count",
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
            initialStatus={row.status == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(`/role_and_permissions/roles/${row.id}/status`, {
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
    allSearchedFields: [
      {
        key: "name",
        searchType: {
          type: "dropdown",
          placeholder: "اسم الدور",
          dynamicDropdown: {
            url: `${baseURL}/role_and_permissions/roles`,
            valueField: "name",
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
        key: "employee_name",
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
              value: "1",
              label: "نشط",
            },
            {
              value: "0",
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
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
     deleteUrl: `${baseURL}/role_and_permissions/roles`,
      executions: [
      {
        label: "تعديل",
        icon: <Edit className="w-4 h-4" />,
        action: (row : {id:string}) => handleOpenRolesSheet({
          isEdit:usePermissions().can(PERMISSIONS.role.update),
          selectedId:row.id
        }),
      }
    ],
    executionConfig: {
      canDelete: usePermissions().can(PERMISSIONS.role.delete),
    },
  };
};
