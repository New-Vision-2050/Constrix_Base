import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CMSAddress } from "../../types/cms-address";

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
        url: `${baseURL}/communication-settings/addresses`,
        columns: [
            {
                key: "address",
                label: t("address") || "Address",
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
                <DropdownMenuItem disabled={!can(PERMISSIONS.CMS.communicationSettings.addresses.update)} onSelect={() => params?.onEdit?.(row.id)}>
                    {t("edit") || "Edit"}
                </DropdownMenuItem>
            ),
        ],
        executionConfig: {
            canDelete: can(PERMISSIONS.CMS.communicationSettings.addresses.delete),
        },
        deleteUrl: `${baseURL}/categories-website`,
        searchParamName: "search",
    };
};
