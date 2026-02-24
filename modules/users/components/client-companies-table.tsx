"use client";

import { baseURL } from "@/config/axios-config";
import { TableBuilder, TableConfig } from "@/modules/table";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useTranslations } from "next-intl";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";

type PropsT = {
  sub_entity_id?: string;
  registration_form_id?: string;
};

const ClientCompaniesTable = ({ sub_entity_id, registration_form_id }: PropsT) => {
  const t = useTranslations("Companies");
  const hasHydrated = useSidebarStore((s) => s.hasHydrated);
  const TABLE_ID = "client-companies-table";

  const companiesConfig = CompaniesConfig();

  const tableConfig: TableConfig = {
    ...companiesConfig,
    url: `${baseURL}/companies/clients`,
    tableId: TABLE_ID,
  };

  return (
    <div className="space-y-7">
      {hasHydrated && (
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <div className="flex items-center gap-3">
              {/* Add any actions here if needed */}
            </div>
          }
        />
      )}
    </div>
  );
};

export default ClientCompaniesTable;
