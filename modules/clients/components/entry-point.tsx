"use client";
import { TableBuilder } from "@/modules/table";
import ClientsStatisticsCards from "./statistics-card";
import { getClientTableConfig } from "./clients-table/ClientTableConfig";
import { CreateClientCxtProvider } from "../context/CreateClientCxt";
import CreateClientSheet from "./create-client/CreateClientSheet";

export default function ClientsEntryPoint() {
  return (
    <CreateClientCxtProvider>
      <div className="flex flex-col gap-4 p-5">
        <ClientsStatisticsCards />

        <TableBuilder
          config={getClientTableConfig()}
          searchBarActions={
            <div className="flex items-center gap-3">
              <CreateClientSheet />
            </div>
          }
        />
      </div>
    </CreateClientCxtProvider>
  );
}
