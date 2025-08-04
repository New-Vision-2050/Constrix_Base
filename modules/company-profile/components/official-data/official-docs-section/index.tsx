"use client";

import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import InfoIcon from "@/public/icons/InfoIcon";
import { useState } from "react";
import DocsTable from "./docs-table";
import { useModal } from "@/hooks/use-modal";
import { SheetFormBuilder } from "@/modules/form-builder";
import { AddDocFormConfig } from "./add-doc-form-config";
import { CompanyDocument } from "@/modules/company-profile/types/company";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SettingsIcon from "@/public/icons/settings";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { Skeleton } from "@/components/ui/skeleton";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

const OfficialDocsSection = ({
  id,
  currentCompanyId
}: {
  id?: string;
  currentCompanyId?: string;
}) => {

      const { data, isPending, isSuccess } = useQuery({
    queryKey: ["company-official-documents", id, currentCompanyId],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyDocument[]>>(
        "/companies/company-profile/company-official-documents",
        {
          params: {
            ...(id && { branch_id: id }),
            ...(currentCompanyId && { company_id:currentCompanyId }),
          },
        }
      );

      return response.data;
    },
  });

  const companyOfficialDocuments = data?.payload ?? [];

  const locale = useLocale();
  const isRTL = locale === "ar";

  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");
  const [isOpenAddDoc, handleOpenAddDoc, handleCloseAddDoc] = useModal();

  const dropdownItems = [
    {
      label: "اضافة مستند رسمي",
      onClick: handleOpenAddDoc,
    },
  ];

  return (
    <>
      {isPending && (
        <div className="border border-gray-500 rounded-2xl p-6 shadow-sm grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      )}

      {isSuccess && (

      <FormFieldSet
        title="المستندات الرسمية"
        valid={
          !!companyOfficialDocuments && companyOfficialDocuments.length > 0
        }
        secondTitle={
          <DropdownMenu dir={isRTL ? "rtl" : "ltr"}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <SettingsIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {dropdownItems.map((item, index) => (
                <DropdownMenuItem key={index} onClick={() => item.onClick()}>
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
     
            {!!companyOfficialDocuments &&
            companyOfficialDocuments.length > 0 ? (
              <DocsTable
                companyOfficialDocuments={companyOfficialDocuments}
                id={id}
              />
            ) : (
              <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
                <InfoIcon additionClass="text-orange-500 " />
                <p className="text-center px-5">
                  يجب اضافة مستند رسمي واحد على الاقل
                </p>
              </div>
            )}
  
      </FormFieldSet>

      )}


      <SheetFormBuilder
        config={AddDocFormConfig(id , currentCompanyId)}
        isOpen={isOpenAddDoc}
        onOpenChange={handleCloseAddDoc}
      />
    </>
  );
};

export default withPermissions(OfficialDocsSection, [PERMISSIONS.companyProfile.officialDocument.view]) ;
