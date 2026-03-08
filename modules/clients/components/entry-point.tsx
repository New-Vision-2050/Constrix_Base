"use client";
import { useEffect } from "react";
import { TableBuilder } from "@/modules/table";
import ClientsStatisticsCards from "./statistics-card";
import { getClientTableConfig } from "./clients-table/ClientTableConfig";
import { CreateClientCxtProvider } from "../context/CreateClientCxt";
import CreateClientSheet from "./create-client/CreateClientSheet";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { ClientsDataCxtProvider } from "../context/ClientsDataCxt";
import { useCreateClientCxt } from "../context/CreateClientCxt";

function ClientsEntryPointContent({ action }: { action?: string | null }) {
  const { openCreateClientSheet } = useCreateClientCxt();

  useEffect(() => {
    if (action === "create") {
      openCreateClientSheet();
    }
  }, [action, openCreateClientSheet]);

  return (
    <Can check={[PERMISSIONS.crm.clients.view]}>
      <div className="flex flex-col gap-4 p-5">
        <ClientsStatisticsCards />

        <TableBuilder
          config={getClientTableConfig()}
          searchBarActions={
            <div className="flex items-center gap-3">
              <Can check={[PERMISSIONS.crm.clients.create]}>
                <CreateClientSheet />
              </Can>
            </div>
          }
        />
      </div>
    </Can>
  );
}

export default function ClientsEntryPoint({ action }: { action?: string | null }) {
  return (
    <ClientsDataCxtProvider>
      <CreateClientCxtProvider>
        <ClientsEntryPointContent action={action} />
      </CreateClientCxtProvider>
    </ClientsDataCxtProvider>
  );
}
