"use client";

import { useParams } from "@i18n/navigation";
import { useIsRtl } from "@/hooks/use-is-rtl";
import NotificationDetailView from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/NotificationDetailView";

export default function AttendancePresenceAssignedTaskDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const isRtl = useIsRtl();
  const dir = isRtl ? "rtl" : "ltr";

  if (!id) {
    return null;
  }

  return (
    <div className="container mx-auto p-6" dir={dir}>
      <NotificationDetailView notificationId={id} readOnly />
    </div>
  );
}
