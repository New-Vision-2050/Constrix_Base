"use client";

import { Button } from "@/components/ui/button";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { useGetSubEntity } from "@/hooks/useGetSubEntity";
import { SheetFormBuilder } from "@/modules/form-builder";
import { GetCompaniesFormConfig } from "@/modules/form-builder/configs/companiesFormConfig";
import { TableBuilder } from "@/modules/table";
import { CompaniesConfig } from "@/modules/table/utils/configs/companiesConfig";
import { useParams } from "next/navigation";
import CompanySaveDialog from "./CompanySaveDialog";
import { useTranslations } from "next-intl";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";

const CompaniesSubEntityTable = () => {
  const { slug }: { slug: string } = useParams();
  const { subEntity } = useGetSubEntity(SUPER_ENTITY_SLUG.COMPANY, slug);
  const defaultAttr = subEntity?.default_attributes ?? [];
  const optionalAttr = subEntity?.optional_attributes ?? [];

  const t = useTranslations("Companies");
  const config = CompaniesConfig();
  const [isOpen, handleOpen, handleClose] = useModal();
  const [companyNumber, setCompanyNumber] = useState<string>("");

  return (
    <div className="px-8 py-7">
      <TableBuilder
        config={config}
        searchBarActions={
          <div className="flex items-center gap-3">
            <SheetFormBuilder
              config={GetCompaniesFormConfig(t)}
              trigger={<Button>{t("createCompany")}</Button>}
            />{" "}
            <CompanySaveDialog
              open={isOpen}
              handleOpen={handleOpen}
              handleClose={handleClose}
              number={companyNumber}
            />
          </div>
        }
      />
    </div>
  );
};

export default CompaniesSubEntityTable;
