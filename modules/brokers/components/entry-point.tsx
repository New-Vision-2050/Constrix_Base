"use client";
import { TableBuilder } from "@/modules/table";
import BrokersStatisticsCards from "./statistics-card";
import { getBrokerTableConfig } from "./brokers-table/BrokerTableConfig";
import { CreateBrokerCxtProvider } from "../context/CreateBrokerCxt";
import CreateBrokerSheet from "./create-broker/CreateBrokerSheet";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { BrokersDataCxtProvider } from "../context/BrokersDataCxt";

export default function BrokersEntryPoint() {
  return (
    <BrokersDataCxtProvider>
      <CreateBrokerCxtProvider>
        <Can check={[PERMISSIONS.clients.clientsPage.view]}>
          <div className="flex flex-col gap-4 p-5">
            <BrokersStatisticsCards />

            <TableBuilder
              config={getBrokerTableConfig()}
              searchBarActions={
                <div className="flex items-center gap-3">
                  <Can check={[PERMISSIONS.clients.clientsPage.create]}>
                    <CreateBrokerSheet />
                  </Can>
                </div>
              }
            />
          </div>
        </Can>
      </CreateBrokerCxtProvider>
    </BrokersDataCxtProvider>
  );
}
