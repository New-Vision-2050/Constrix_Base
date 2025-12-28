import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CMSAddress } from "../../types/cms-address";
import { baseURL } from "@/config/axios-config";

export interface AddressRow extends CMSAddress { }

type Params = {
    onEdit?: (id: string) => void;
};

export const useAddressListTableConfig: (params?: Params) => TableConfig = (
    params
) => {
    const { can } = usePermissions();
    const t = useTranslations("content-management-system.communicationSetting.table");

    return {
        tableId: "communication-settings-address-list-table",
        url: `${baseURL}/website-addresses`,
        columns: [
            {
                key: "title",
                label: t("address") || "Address",
                sortable: true
            },
            {
                key: "address",
                label: t("address") || "City",
                sortable: true
            },
            {
                key: "latitude",
                label: t("latitude") || "Latitude",
                sortable: true
            },
            {
                key: "longitude",
                label: t("longitude") || "Longitude",
                sortable: true,
            },
        ],
        executions: [
            (row) => (
                <DropdownMenuItem 
                 //disabled={!can(PERMISSIONS.CMS.communicationSettings.addresses.update)}
                 onSelect={() => params?.onEdit?.(row.id)}>
                    {t("edit") || "Edit"}
                </DropdownMenuItem>
            ),
        ],
        executionConfig: {
            canDelete: can(PERMISSIONS.CMS.communicationSettings.addresses.delete),
        },
        deleteUrl: "website-addresses",
        searchParamName: "search",
    };
};
