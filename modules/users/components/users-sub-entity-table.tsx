"use client";

import { baseURL } from "@/config/axios-config";
import { SuperEntitySlug, useGetSubEntity } from "@/hooks/useGetSubEntity";
import Can from "@/lib/permissions/client/Can";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import { TableBuilder, TableConfig } from "@/modules/table";
import { UsersConfigV2 } from "@/modules/table/utils/configs/usersTableConfigV2";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useParams } from "next/navigation";
import UsersSubEntityForm from "./users-sub-entity-form";
import { ClientsDataCxtProvider } from "@/modules/clients/context/ClientsDataCxt";
import { CreateClientCxtProvider } from "@/modules/clients/context/CreateClientCxt";
import { BrokersDataCxtProvider } from "@/modules/brokers/context/BrokersDataCxt";
import { CreateBrokerCxtProvider } from "@/modules/brokers/context/CreateBrokerCxt";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { subEntityStatisticsConfig } from "./users-sub-entity-statistics-config";

type PropsT = {
  programName: SuperEntitySlug;
};

const UsersSubEntityTable = ({ programName }: PropsT) => {
  const hasHydrated = useSidebarStore((s) => s.hasHydrated);
  const { slug }: { slug: string } = useParams();
  const { subEntity } = useGetSubEntity(programName, slug);
  const { can } = usePermissions();
  const defaultAttr = subEntity?.default_attributes.map((item) => item.id);
  const optionalAttr = subEntity?.optional_attributes.map((item) => item.id);
  const TABLE_ID = `${subEntity?.slug}-users`;
  const sub_entity_id = subEntity?.id;
  const registration_form_id = subEntity?.registration_form?.id;
  const entityPermissions = createPermissions(`DYNAMIC.${slug}`);
  const registrationFormSlug = subEntity?.registration_form?.slug;

  const usersConfig = UsersConfigV2({
    canDelete: can(entityPermissions.delete),
    canEdit: can(entityPermissions.update),
    canView: can(entityPermissions.view),
    registrationFormSlug
  });
  const allSearchedFields = usersConfig.allSearchedFields.filter((field) =>
    field.key === "email_or_phone"
      ? optionalAttr?.includes("email") || optionalAttr?.includes("phone")
      : optionalAttr?.includes(field.name || field.key)
  );

  const tableConfig: TableConfig = {
    ...usersConfig,
    url: `${baseURL}/sub_entities/records/list?sub_entity_id=${sub_entity_id}&registration_form_id=${registration_form_id}`,
    defaultVisibleColumnKeys: defaultAttr,
    availableColumnKeys: optionalAttr,
    tableId: TABLE_ID,
    allSearchedFields,
    enableExport: can(entityPermissions.export),
  };

  if (!can(entityPermissions.list)) {
    return null;
  }

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow
        config={subEntityStatisticsConfig(
          sub_entity_id ?? "",
          registration_form_id ?? ""
        )}
      />{" "}
      {hasHydrated && !!subEntity && (
        <BrokersDataCxtProvider>
          <CreateBrokerCxtProvider>
            <ClientsDataCxtProvider>
              <CreateClientCxtProvider>
                <TableBuilder
                  config={tableConfig}
                  searchBarActions={
                    <div className="flex items-center gap-3">
                      <Can check={[entityPermissions.create]}>
                        <UsersSubEntityForm
                          tableId={TABLE_ID}
                          sub_entity_id={sub_entity_id}
                          slug={slug}
                          registrationFormSlug={registrationFormSlug}
                        />
                      </Can>
                    </div>
                  }
                />
              </CreateClientCxtProvider>
            </ClientsDataCxtProvider>
          </CreateBrokerCxtProvider>
        </BrokersDataCxtProvider>
      )}
    </div>
  );
};

export default UsersSubEntityTable;
