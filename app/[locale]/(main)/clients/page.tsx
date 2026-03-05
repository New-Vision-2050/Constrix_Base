"use client";

import { useSearchParams } from "next/navigation";
import ClientsEntryPoint from "@/modules/clients/components/entry-point";
import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

function ClientsPageWrapper() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  
  return <ClientsEntryPoint action={action} />;
}

export default withPermissionsPage(ClientsPageWrapper, [
  PERMISSIONS.crm.clients.list,
]);
