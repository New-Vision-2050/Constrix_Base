"use client";

import I18nLink from "@i18n/link";
import type { ProjectNotification } from "@/services/api/projects/notifications/types/response";
import { getAssignedTaskNotificationHref } from "./assignedTaskNavigation";

interface AssignedTaskNotificationLinkProps {
  row: ProjectNotification;
}

export default function AssignedTaskNotificationLink({
  row,
}: AssignedTaskNotificationLinkProps) {
  const label = row.notification_number?.trim() || "—";
  const href = getAssignedTaskNotificationHref(row);

  if (!href || label === "—") {
    return <span className="text-sm font-bold">{label}</span>;
  }

  return (
    <I18nLink
      href={href}
      onClick={(event) => event.stopPropagation()}
      className="inline-block cursor-pointer text-sm font-bold text-primary underline underline-offset-2 hover:opacity-80"
    >
      {label}
    </I18nLink>
  );
}
