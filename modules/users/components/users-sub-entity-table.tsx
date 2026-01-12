"use client";

import { baseURL } from "@/config/axios-config";
import { SuperEntitySlug, useGetSubEntity } from "@/hooks/useGetSubEntity";
import Can from "@/lib/permissions/client/Can";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import { TableBuilder, TableConfig } from "@/modules/table";
import { UsersConfigV2 } from "@/modules/table/utils/configs/usersTableConfigV2";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useParams } from "@i18n/navigation";
import UsersSubEntityForm from "./users-sub-entity-form";
import { ClientsDataCxtProvider } from "@/modules/clients/context/ClientsDataCxt";
import { CreateClientCxtProvider } from "@/modules/clients/context/CreateClientCxt";
import { BrokersDataCxtProvider } from "@/modules/brokers/context/BrokersDataCxt";
import { CreateBrokerCxtProvider } from "@/modules/brokers/context/CreateBrokerCxt";
import StatisticsRow from "@/components/shared/layout/statistics-row";
import { subEntityStatisticsConfig } from "./users-sub-entity-statistics-config";
import useUserData from "@/hooks/use-user-data";
import { useCRMSharedSetting } from "@/modules/crm-settings/hooks/useCRMSharedSetting";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@mui/material";
import { RefreshCcwIcon } from "lucide-react";

type PropsT = {
  programName: SuperEntitySlug;
};

const UsersSubEntityTable = ({ programName }: PropsT) => {
  const t = useTranslations();
  // current user data
  const { data: userData } = useUserData();
  // shared settings
  const { data: sharedSettings } = useCRMSharedSetting();
  // toggle refetch
  const [toggleRefetch, setToggleRefetch] = useState(0);
  // is share client
  const isShareClient = sharedSettings?.is_share_client == "1";
  // is share broker
  const isShareBroker = sharedSettings?.is_share_broker == "1";
  // current user id
  const currentUserId = userData?.payload?.id;
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

  // Check if data is loaded
  const isDataLoaded = sharedSettings !== undefined && userData !== undefined;

  // handle refresh widgets data
  const handleRefreshWidgetsData = () => {
    setToggleRefetch((prev) => ++prev);
  };

  const usersConfig = UsersConfigV2({
    canDelete: can(entityPermissions.delete),
    canEdit: can(entityPermissions.update),
    canView: can(entityPermissions.view),
    registrationFormSlug,
    isShareClient,
    isShareBroker,
    currentUserId,
    handleRefreshWidgetsData,
    tableId: TABLE_ID,
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

  // Don't render table until data is loaded
  if (!isDataLoaded) {
    return (
      <div className="px-8 space-y-7">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">{t("Main.Loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 space-y-7">
      <StatisticsRow
        toggleRefetch={toggleRefetch}
        config={subEntityStatisticsConfig(
          sub_entity_id ?? "",
          registration_form_id ?? ""
        )}
      />{" "}
      {hasHydrated && !!subEntity && (
        <BrokersDataCxtProvider>
          <CreateBrokerCxtProvider tableId={TABLE_ID}>
            <ClientsDataCxtProvider>
              <CreateClientCxtProvider tableId={TABLE_ID}>
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
                          handleRefreshWidgetsData={handleRefreshWidgetsData}
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
