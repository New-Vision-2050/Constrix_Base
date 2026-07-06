import { notFound } from "next/navigation";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import { ContractualEngagementProvider } from "@/modules/projects/project/context/ContractualEngagementContext";
import {
  isContractualEngagementKey,
  type ContractualEngagementKey,
} from "@/modules/projects/project/constants/contractualEngagementKeys";
import NotificationDetailView from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/NotificationDetailView";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ key: string; notificationId: string }>;
};

async function UnifiedContractNotificationDetailPage({
  params,
}: PageProps) {
  const { key, notificationId } = await params;

  if (!key || !notificationId || !isContractualEngagementKey(key)) {
    notFound();
  }

  return (
    <ContractualEngagementProvider
      contractualEngagementKey={key as ContractualEngagementKey}
    >
      <NotificationDetailView
        contractualEngagementKey={key}
        notificationId={notificationId}
      />
    </ContractualEngagementProvider>
  );
}

export default withServerPermissionsPage(UnifiedContractNotificationDetailPage, [
  PERMISSIONS.projectManagement.list,
]);
