"use client";

import { Button } from "@/components/ui/button";
import { baseURL } from "@/config/axios-config";
import { REGISTRATION_FORMS } from "@/constants/registration-forms";
import { SuperEntitySlug, useGetSubEntity } from "@/hooks/useGetSubEntity";
import Can from "@/lib/permissions/client/Can";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import {
  SheetFormBuilder,
  GetCompanyUserFormConfig,
  useSheetForm,
} from "@/modules/form-builder";
import { TableBuilder, TableConfig } from "@/modules/table";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { UsersConfigV2 } from "@/modules/table/utils/configs/usersTableConfigV2";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import UsersSubEntityForm from "./users-sub-entity-form";

type PropsT = {
  programName: SuperEntitySlug;
};

const UsersSubEntityTable = ({ programName }: PropsT) => {
  const t = useTranslations("Companies");

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
      <h1>
        Test101 {programName} - {registrationFormSlug}
      </h1>
      {hasHydrated && !!subEntity && (
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
      )}
    </div>
  );
};

export default UsersSubEntityTable;
