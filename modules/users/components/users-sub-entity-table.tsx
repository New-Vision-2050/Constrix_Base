"use client";

import { Button } from "@/components/ui/button";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { useGetSubEntity } from "@/hooks/useGetSubEntity";
import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import {
  SheetFormBuilder,
  GetCompanyUserFormConfig,
} from "@/modules/form-builder";
import { TableBuilder } from "@/modules/table";
import { UsersConfig } from "@/modules/table/utils/configs/usersTableConfig";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const UsersSubEntityTable = () => {
  const hasHydrated = useSidebarStore((s) => s.hasHydrated);
  const { slug }: { slug: string } = useParams();
  const { subEntity } = useGetSubEntity(SUPER_ENTITY_SLUG.USERS, slug);
  const defaultAttr = subEntity?.default_attributes.map((item) => item.id);
  const optionalAttr = subEntity?.optional_attributes.map((item) => item.id);

  const config = {
    ...UsersConfig(),
    defaultVisibleColumnKeys: defaultAttr,
    availableColumnKeys: optionalAttr,
  };

  const t = useTranslations("Companies");

  return (
    <div className="px-8 space-y-7">
      {hasHydrated && (
        <TableBuilder
          config={config}
          searchBarActions={
            <div className="flex items-center gap-3">
              <SheetFormBuilder
                config={GetCompanyUserFormConfig(t)}
                trigger={<Button>إنشاء مستخدم</Button>}
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
