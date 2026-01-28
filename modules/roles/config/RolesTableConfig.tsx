import TableStatusSwitcher from "@/components/shared/table-status";
import { apiClient, baseURL } from "@/config/axios-config";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";

export const useRolesTableConfig = ({
  handleOpenRolesSheet,
}: {
  handleOpenRolesSheet: ({
    isEdit,
    selectedId,
  }: {
    isEdit: boolean;
    selectedId?: string;
  }) => void;
}) => {
  const { can } = usePermissions();
  const t = useTranslations("companyProfile");
  return {
    url: `${baseURL}/role_and_permissions/roles`,
    tableId: "roles-table",
    columns: [
      {
        key: "name",
        label: t("header.rules.name"),
        sortable: true,
      },
      {
        key: "programs_count",
        label: t("header.rules.programsCount"),
        sortable: true,
      },
      {
        key: "permission_count",
        label: t("header.rules.permissionsCount"),
        sortable: true,
      },
      {
        key: "users_count",
        label: t("header.rules.usersCount"),
        sortable: true,
      },
      {
        key: "is_active",
        label: t("header.rules.status"),
        sortable: true,
        render: (_: unknown, row: any) => (
          <TableStatusSwitcher
            id={row.id}
            label={t("header.rules.active")}
            initialStatus={row.status == 1}
            confirmAction={async (isActive) => {
              return await apiClient.patch(
                `/role_and_permissions/roles/${row.id}/status`,
                {
                  status: Number(isActive),
                }
              );
            }}
            confirmDescription={(isActive) =>
              !isActive ? t("header.rules.deactivate") : t("header.rules.activate")
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
          placeholder: t("header.rules.name"),
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
          placeholder: t("header.rules.employeeName"),
        },
      },
      {
        key: "status",
        searchType: {
          type: "dropdown",
          placeholder: t("header.rules.status"),
          dropdownOptions: [
            {
              value: "1",
              label: t("header.rules.active"),
            },
            {
              value: "0",
              label: t("header.rules.inactive"),
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
    enableExport: can(PERMISSIONS.role.export),
    searchFields: ["name", "email"],
    searchParamName: "search",
    searchFieldParamName: "fields",
    allowSearchFieldSelection: true,
    deleteUrl: `${baseURL}/role_and_permissions/roles`,
    executions: [
      {
        label: t("header.rules.edit"),
        icon: <Edit className="w-4 h-4" />,
        action: (row: { id: string }) =>
          handleOpenRolesSheet({
            isEdit: can(PERMISSIONS.role.update),
            selectedId: row.id,
          }),
        disabled: can(PERMISSIONS.role.update),
      },
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.role.delete),
    },
  };
};
