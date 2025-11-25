import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { CMSSocialLink } from "../../types/cms-liink";
import Image from "next/image";
import { baseURL } from "@/config/axios-config";

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
        tableId: "cms-communication-settings-social-links-list-table",
        url: `${baseURL}/social-media-links`,
        columns: [
            {
                key: "icon_url",
                label: t("socialIcon") || "Social Icon",
                sortable: false,
                render: (value: string) => (
                    value ? (
                        <Image 
                            src={value} 
                            alt="Social Icon" 
                            width={40} 
                            height={40} 
                            className="object-cover rounded"
                            style={{ width: '50%', height: 'auto', maxWidth: '50px' }}
                        />
                    ) : (
                        <span className="text-gray-400">-</span>
                    )
                )
            },
            {
                key: "type.name",
                label: t("type") || "Type",
                sortable: true,
            },
            {
                key: "link",
                label: t("url") || "URL",
                sortable: true,
                render: (value: string) => (
                    <a 
                        href={value} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate max-w-xs block"
                    >
                        {value}
                    </a>
                )
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
        deleteUrl: `${baseURL}/social-media-links`,
        searchParamName: "search",
    };
};
