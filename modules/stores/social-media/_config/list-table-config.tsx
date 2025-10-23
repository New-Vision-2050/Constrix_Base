import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { Edit } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

// Social Media row type interface
export interface SocialMediaRow {
  id: string;
  platform: string;
  link: string;
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
    url: `${baseURL}/ecommerce/dashboard/products`,
    deleteUrl: `${baseURL}/ecommerce/dashboard/social-media`,

    // Add row actions for edit
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => onEdit?.(row.id)}>
          <Edit className="w-4 h-4" />
          {t("labels.edit")}
        </DropdownMenuItem>
      ),
    ],

    executionConfig: {
      canDelete: false,
    },

    columns: [
      {
        key: "platform",
        label: t("socialMedia.platform"),
        sortable: true,
        render: (value: string) => (
          <span className="font-medium capitalize">{value}</span>
        ),
      },
      {
        key: "link",
        label: t("socialMedia.link"),
        sortable: false,
        render: (value: string) => (
          <span className="text-gray-400">{value}</span>
        ),
      },
      {
        key: "is_active",
        label: t("socialMedia.status"),
        sortable: false,
        render: (value: boolean, row: SocialMediaRow) => (
          <Switch
            checked={value}
            onCheckedChange={() => onToggle?.(row.id, !value)}
          />
        ),
      },
    ],
  };
};
