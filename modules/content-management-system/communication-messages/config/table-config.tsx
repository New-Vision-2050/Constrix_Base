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
    url: `${baseURL}/website-contact-messages`,
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
        key: "address",
        label: t("address"),
        sortable: false,
      },
      {
        key: "status",
        label: t("status"),
        sortable: true,
        render: (status: 0 | 1) => {
          const statusText = status == 1 ? t("replied") : t("pending");
          const statusColor = status == 1 ? "default" : "secondary";
          return <Badge variant={statusColor}>
            {statusText}
          </Badge>
        },
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
          disabled={row.status === 1 || !can(PERMISSIONS.CMS.communicationMessages?.update)}
          onSelect={() => params?.onReply?.(row.id)}
        >
          {t("reply")}
        </DropdownMenuItem>
      ),
    ],
    executionConfig: {
      canDelete: can(PERMISSIONS.CMS.communicationMessages?.delete),
    },
    deleteUrl: `${baseURL}/website-contact-messages`,
    searchParamName: "search",
  };
};

