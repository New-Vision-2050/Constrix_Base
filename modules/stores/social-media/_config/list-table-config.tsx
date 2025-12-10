import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { Edit } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import TheStatus from "../components/the-status";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

// Social Media row type interface
export interface SocialMediaRow {
  id: string;
  social_icon: {
    id: string;
    name: string;
  };
  url: string;
  is_active: boolean;
}

export interface SocialMediaListTableConfigProps {
  onEdit?: (id: string) => void;
  onToggle?: (id: string, isActive: boolean) => void;
}

export const useSocialMediaListTableConfig: (
  props?: SocialMediaListTableConfigProps
) => TableConfig = (props) => {
  const t = useTranslations();
  const { can } = usePermissions();
  const { onEdit, onToggle } = props || {};

  return {
    tableId: "social-media-list-table",
    url: `${baseURL}/ecommerce/dashboard/social_media`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/social_media`,
    columns: [
      {
        key: "social_icon.name",
        label: t("socialMedia.platform"),
        sortable: true,
        render: (value: string, row: SocialMediaRow) => (
          <span className="font-medium capitalize">
            {row.social_icon?.name || value || "-"}
          </span>
        ),
      },
      {
        key: "url",
        label: t("socialMedia.link"),
        sortable: false,
      },
      {
        key: "is_active",
        label: t("socialMedia.status"),
        sortable: false,
        render: (value: "active" | "inActive", row: SocialMediaRow) => (
          <TheStatus disabled={!can(PERMISSIONS.ecommerce.socialMedia.activate)} theStatus={value} id={row.id} />
        ),
      },
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.ecommerce.socialMedia.delete),
    },
    executions: [
      (row) => (
        <DropdownMenuItem disabled={!can(PERMISSIONS.ecommerce.socialMedia.update)} onSelect={() => onEdit?.(row.id)}>
          <Edit className="w-4 h-4" />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    searchParamName: "search",
  };
};
