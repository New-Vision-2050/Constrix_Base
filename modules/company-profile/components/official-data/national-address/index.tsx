"use client";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import InfoIcon from "@/public/icons/InfoIcon";
import React, { useState } from "react";
import NationalAddressDataPreview from "./national-address-data-preview";
import { Button } from "@/components/ui/button";
import PencilLineIcon from "@/public/icons/pencil-line";
import EyeIcon from "@/public/icons/eye-icon";
import NationalAddressForm from "./national-address-form";
import { CompanyAddress } from "@/modules/company-profile/types/company";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { Skeleton } from "@/components/ui/skeleton";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import Can from "@/lib/permissions/client/Can";
import { useTranslations } from "next-intl";
const NationalAddress = ({
  id,
  currentCompanyId,
}: {
  id?: string;
  currentCompanyId?: string;
}) => {
  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["company-address", id, currentCompanyId],
    queryFn: async () => {
      const response = await apiClient.get<
        ServerSuccessResponse<CompanyAddress>
      >("/companies/company-profile/company-address", {
        params: {
          ...(id && { branch_id: id }),
          ...(currentCompanyId && { company_id: currentCompanyId }),
        },
      });

      return response.data;
    },
  });

  const companyAddress = data?.payload;
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  const noAddressMessage = (
    <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
      <InfoIcon additionClass="text-orange-500 " />
      <p className="text-center px-5">يجب تحديد عنوان واحد على الاقل</p>
    </div>
  );
const t = useTranslations("UserProfile.header.officialData");
  return (
    <>
      {isPending && (
        <div className="border border-gray-500 rounded-2xl p-6 shadow-sm grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      )}

      {isSuccess && (
        <FormFieldSet
          title={t("nationalAddress")}
          valid={!!companyAddress}
          secondTitle={
            <Can check={[PERMISSIONS.companyProfile.address.update]}>
              <Button variant={"ghost"} onClick={handleEditClick}>
                {mode === "Preview" ? (
                  <PencilLineIcon additionalClass="text-pink-600" />
                ) : (
                  <EyeIcon />
                )}
              </Button>
            </Can>
          }
        >
          {mode === "Preview" ? (
            <>
              {companyAddress ? (
                <NationalAddressDataPreview companyAddress={companyAddress} />
              ) : (
                noAddressMessage
              )}
            </>
          ) : (
            <>
              {companyAddress ? (
                <NationalAddressForm
                  companyAddress={companyAddress}
                  id={id}
                  handleEditClick={handleEditClick}
                  currentCompanyId={currentCompanyId}
                />
              ) : (
                noAddressMessage
              )}
            </>
          )}
        </FormFieldSet>
      )}
    </>
  );
};

export default NationalAddress;