"use client";

import { useSearchParams } from "next/navigation";
import { CreateClientCxtProvider, useCreateClientCxt } from "@/modules/clients/context/CreateClientCxt";
import { ClientsDataCxtProvider } from "@/modules/clients/context/ClientsDataCxt";
import CreateClientSheet from "@/modules/clients/components/create-client/CreateClientSheet";
import { useEffect } from "react";
import UsersSubEntityTable from "@/modules/users/components/users-sub-entity-table";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";

function CreateClientPageContent() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const { openCreateClientSheet } = useCreateClientCxt();

  useEffect(() => {
    if (action === "create") {
      // Small delay to ensure context is ready
      const timer = setTimeout(() => {
        openCreateClientSheet();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [action, openCreateClientSheet]);

  // Use the same component structure as client-relations/client
  return <UsersSubEntityTable programName={SUPER_ENTITY_SLUG.CRM} />;
}

export default function CreateClientPage() {
  return (
    <ClientsDataCxtProvider>
      <CreateClientCxtProvider>
        <CreateClientPageContent />
      </CreateClientCxtProvider>
    </ClientsDataCxtProvider>
  );
}
