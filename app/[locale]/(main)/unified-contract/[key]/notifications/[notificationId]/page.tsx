"use client";

import { useParams } from "@i18n/navigation";
import { notFound } from "next/navigation";
import { ContractualEngagementProvider } from "@/modules/projects/project/context/ContractualEngagementContext";
import {
  isContractualEngagementKey,
  type ContractualEngagementKey,
} from "@/modules/projects/project/constants/contractualEngagementKeys";
import NotificationDetailView from "@/modules/projects/project/components/project-tabs/tabs/maintenance-emergency/components/NotificationDetailView";

export default function UnifiedContractNotificationDetailPage() {
  const params = useParams();
  const key = params?.key as string | undefined;
  const notificationId = params?.notificationId as string | undefined;

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
