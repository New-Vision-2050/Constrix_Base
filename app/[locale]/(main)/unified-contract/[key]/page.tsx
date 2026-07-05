import { PERMISSIONS } from "@/lib/permissions/permission-names";
import withServerPermissionsPage from "@/lib/permissions/server/withServerPermissionsPage";
import UnifiedContractView from "@/modules/projects/project/views/unified-contract";
import {
  CONTRACTUAL_ENGAGEMENT_KEYS,
  isContractualEngagementKey,
} from "@/modules/projects/project/constants/contractualEngagementKeys";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ key: string }>;
};

async function UnifiedContractPage({ params }: PageProps) {
  const { key } = await params;
  if (!isContractualEngagementKey(key)) {
    notFound();
  }

  return <UnifiedContractView contractualEngagementKey={key} />;
}

export default withServerPermissionsPage(UnifiedContractPage, [
  PERMISSIONS.projectManagement.list,
]);

export function generateStaticParams() {
  return [
    { key: CONTRACTUAL_ENGAGEMENT_KEYS.MAKKAH_UNIFIED },
    { key: CONTRACTUAL_ENGAGEMENT_KEYS.JEDDAH_UNIFIED },
  ];
}
