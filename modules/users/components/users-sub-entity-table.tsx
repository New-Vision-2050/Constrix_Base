"use client";

import { Button } from "@/components/ui/button";
import {
  REGISTRATION_FORMS,
  REGISTRATION_FORMS_SLUGS,
} from "@/constants/registration-forms";
import { SuperEntitySlug, useGetSubEntity } from "@/hooks/useGetSubEntity";
import {
  SheetFormBuilder,
  GetCompanyUserFormConfig,
} from "@/modules/form-builder";
import { TableBuilder } from "@/modules/table";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const UsersSubEntityTable = ({
  programName,
}: {
  programName: SuperEntitySlug;
}) => {
  const hasHydrated = useSidebarStore((s) => s.hasHydrated);
  const { slug }: { slug: string } = useParams();
  const { subEntity } = useGetSubEntity(programName, slug);
  const defaultAttr = subEntity?.default_attributes.map((item) => item.id);
  const optionalAttr = subEntity?.optional_attributes.map((item) => item.id);

  const registrationFormSlug = subEntity?.registration_form?.slug;
  const registrationFromConfig = registrationFormSlug
    ? REGISTRATION_FORMS[registrationFormSlug]
    : GetCompanyUserFormConfig;

  const buttonText =
    subEntity?.registration_form.slug === REGISTRATION_FORMS_SLUGS.EMPLOYEE
      ? "موظف"
      : subEntity?.registration_form.slug === REGISTRATION_FORMS_SLUGS.CUSTOMER
      ? "عميل"
      : subEntity?.registration_form.slug === REGISTRATION_FORMS_SLUGS.RESELLER
      ? "وسيط"
      : "مستخدم";

  const config = {
    ...UsersConfig(),
    defaultVisibleColumnKeys: defaultAttr,
    availableColumnKeys: optionalAttr,
  };

  const t = useTranslations("Companies");

  return (
    <div className="px-8 space-y-7">
      {hasHydrated && !!subEntity && (
        <TableBuilder
          config={config}
          searchBarActions={
            <div className="flex items-center gap-3">
              <SheetFormBuilder
                config={
                  registrationFromConfig
                    ? registrationFromConfig(t)
                    : GetCompanyUserFormConfig(t)
                }
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
