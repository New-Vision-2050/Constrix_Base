'use client';
import { TableBuilder } from "@/modules/table";
import ClientsStatisticsCards from "./statistics-card";
import { getClientTableConfig } from "./clients-table/ClientTableConfig";

export default function ClientsEntryPoint() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <ClientsStatisticsCards />

      <TableBuilder
        config={getClientTableConfig()}
        searchBarActions={
          <div className="flex items-center gap-3">
            {/* <Can check={[PERMISSIONS.vacations.settings.leaveType.create]}>
              <SheetFormBuilder
                config={getSetVacationTypeFormConfig(t, handleOnSuccessFn)}
                trigger={<Button>{t("addVacationType")}</Button>}
              />
            </Can> */}
          </div>
        }
      />
    </div>
  );
}
