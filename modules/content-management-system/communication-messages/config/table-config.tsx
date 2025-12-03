"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { baseURL } from "@/config/axios-config";
import { TableConfig } from "@/modules/table";
import { useTranslations } from "next-intl";
import { CommunicationMessage } from "../types";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Badge } from "@/components/ui/badge";

type Params = {
  onReply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
};

/**
 * Configuration for communication messages table
 * - Supports RTL/LTR via table component
 * - Light/Dark mode styling
 * - Actions: Reply, View Details, Delete
 */
export const useCommunicationMessagesTableConfig: (
  params?: Params
) => TableConfig = (params) => {
  const { can } = usePermissions();
  const t = useTranslations("content-management-system.communicationMessages");

  return {
    tableId: "communication-messages-table",
    url: `${baseURL}/communication-messages`,
    columns: [
      {
        key: "name",
        label: t("name"),
        sortable: true,
      },
      {
        key: "email",
        label: t("email"),
        sortable: true,
      },
      {
        key: "phone",
        label: t("phone"),
        sortable: false,
      },
      {
        key: "subject",
        label: t("subject"),
        sortable: true,
      },
      {
        key: "status",
        label: t("status"),
        sortable: true,
        render: (row: CommunicationMessage) => (
          <Badge variant={row.status === "replied" ? "default" : "secondary"}>
            {t(row.status)}
          </Badge>
        ),
      },
      // message
      {
        key: "message",
        label: t("message"),
        sortable: false,
      }
    ],
    executions: [
      (row) => (
        <DropdownMenuItem onSelect={() => params?.onViewDetails?.(row.id)}>
          {t("details")}
        </DropdownMenuItem>
      ),
      (row) => (
        <DropdownMenuItem
          disabled={row.status === "replied" || !can(PERMISSIONS.CMS.communicationMessages?.update)}
          onSelect={() => params?.onReply?.(row.id)}
        >
          {t("reply")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.CMS.communicationMessages?.delete),
    },
    deleteUrl: `${baseURL}/communication-messages`,
    searchParamName: "search",
  };
};

