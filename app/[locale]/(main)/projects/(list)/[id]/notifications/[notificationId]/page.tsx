"use client";

import { useParams } from "@i18n/navigation";
import { ProjectProvider } from "@/modules/all-project/context/ProjectContext";
import NotificationDetailView from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/NotificationDetailView";

export default function ProjectNotificationDetailPage() {
  const params = useParams();
  const projectId = params?.id as string | undefined;
  const notificationId = params?.notificationId as string | undefined;

  if (!projectId || !notificationId) {
    return null;
  }

  return (
    <ProjectProvider projectId={projectId}>
      <NotificationDetailView projectId={projectId} notificationId={notificationId} />
    </ProjectProvider>
  );
}
