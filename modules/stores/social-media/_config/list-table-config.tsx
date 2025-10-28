import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { Edit } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import TheStatus from "../components/the-status";

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
          <TheStatus theStatus={value} id={row.id} />
        ),
      },
    ],
    executionConfig: {
      canDelete: true,
    },
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => onEdit?.(row.id)}>
          <Edit className="w-4 h-4" />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],
    searchParamName: "search",
  };
};
