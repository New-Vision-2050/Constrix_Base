"use client";

import { Button } from "@/components/ui/button";
import { baseURL } from "@/config/axios-config";
import {
  REGISTRATION_FORMS,
  REGISTRATION_FORMS_SLUGS,
  REGISTRATION_TABLES,
} from "@/constants/registration-forms";
import { SuperEntitySlug, useGetSubEntity } from "@/hooks/useGetSubEntity";
import {
  SheetFormBuilder,
  GetCompanyUserFormConfig,
} from "@/modules/form-builder";
import { TableBuilder } from "@/modules/table";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const UsersSubEntityTable = ({
  programName,
}: {
  programName: SuperEntitySlug;
}) => {
  const t = useTranslations("Companies");

  const hasHydrated = useSidebarStore((s) => s.hasHydrated);
  const { slug }: { slug: string } = useParams();
  const { subEntity } = useGetSubEntity(programName, slug);
  const defaultAttr = subEntity?.default_attributes.map((item) => item.id);
  const optionalAttr = subEntity?.optional_attributes.map((item) => item.id);
  const TABLE_ID = `${subEntity?.slug}-users`;
  const sub_entity_id = subEntity?.id;
  const registration_form_id = subEntity?.registration_form?.id;

  const registrationFormSlug = subEntity?.registration_form?.slug;

  const registrationFromConfig = registrationFormSlug
    ? REGISTRATION_FORMS[registrationFormSlug]
    : GetCompanyUserFormConfig;

  const RegistrationTableConfig = registrationFormSlug
    ? REGISTRATION_TABLES[registrationFormSlug]
    : UsersConfig;

  const buttonText =
    subEntity?.registration_form.slug === REGISTRATION_FORMS_SLUGS.EMPLOYEE
      ? "موظف"
      : subEntity?.registration_form.slug === REGISTRATION_FORMS_SLUGS.CLIENT
      ? "عميل"
      : subEntity?.registration_form.slug === REGISTRATION_FORMS_SLUGS.BROKER
      ? "وسيط"
      : "مستخدم";

  console.log({ registrationFormSlug });

  const tableConfig = {
    ...UsersConfig(),
    url: `${baseURL}/sub_entities/records/list?sub_entity_id=${sub_entity_id}&registration_form_id=${registration_form_id}`,
    defaultVisibleColumnKeys: defaultAttr,
    availableColumnKeys: optionalAttr,
    tableId: TABLE_ID,
    // url: `${baseURL}/sub_entities/records/list?sub_entity_id=${sub_entity_id}&registration_form_id=${registration_form_id}`,
  };

  const finalFormConfig = Boolean(registrationFromConfig)
    ? registrationFromConfig
    : GetCompanyUserFormConfig;

  return (
    <div className="px-8 space-y-7">
      {hasHydrated && !!subEntity && (
        <TableBuilder
          config={tableConfig}
          searchBarActions={
            <div className="flex items-center gap-3">
              <SheetFormBuilder
                config={{
                  ...finalFormConfig(t),
                  onSuccess: () => {
                    const tableStore = useTableStore.getState();
                    tableStore.reloadTable(TABLE_ID);
                    setTimeout(() => {
                      tableStore.setLoading(TABLE_ID, false);
                    }, 100);
                  },
                }}
                trigger={<Button>إنشاء {buttonText}</Button>}
                onSuccess={(values) => {
                  console.log("Form submitted successfully:", values);
                }}
              />{" "}
            </div>
          }
        />
      )}
    </div>
  );
};

export default UsersSubEntityTable;
