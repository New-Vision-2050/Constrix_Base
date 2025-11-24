import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CMSSocialLink } from "../../types/cms-liink";

export interface SocialLinksRow extends CMSSocialLink { }

type Params = {
    onEdit?: (id: string) => void;
};

export const useSocialLinksListTableConfig: (params?: Params) => TableConfig = (
    params
) => {
    const { can } = usePermissions();
    const t = useTranslations("content-management-system.communicationSetting.socialLinksTable");

    return {
        tableId: "communication-settings-social-links-list-table",
        url: `${baseURL}/communication-settings/social-links`,
        columns: [
            {
                key: "social_icon",
                label: t("socialIcon") || "Social Icon",
                sortable: true
            },
            {
                key: "type",
                label: t("type") || "Type",
                sortable: true,
            },
            {
                key: "url",
                label: t("url") || "URL",
                sortable: true
            }, 
        ],
        executions: [
            (row) => (
                <DropdownMenuItem disabled={!can(PERMISSIONS.CMS.communicationSettings.socialLinks.update)} onSelect={() => params?.onEdit?.(row.id)}>
                    {t("edit") || "Edit"}
                </DropdownMenuItem>
            ),
        ],
        executionConfig: {
            canDelete: can(PERMISSIONS.CMS.communicationSettings.socialLinks.delete),
        },
        deleteUrl: `${baseURL}/categories-website`,
        searchParamName: "search",
    };
};
