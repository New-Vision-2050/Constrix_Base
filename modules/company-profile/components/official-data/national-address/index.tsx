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
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

const NationalAddress = ({
  id,
  currentCompanyId
}: {
  id?: string;
  currentCompanyId?: string
}) => {
  const permissions = can([PERMISSION_ACTIONS.VIEW, PERMISSION_ACTIONS.UPDATE] , PERMISSION_SUBJECTS.COMPANY_PROFILE_ADDRESS) as {
    VIEW: boolean;
    UPDATE: boolean;
  }

  const { data, isPending, isSuccess } = useQuery({
    queryKey: ["company-address", id, currentCompanyId],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyAddress>>(
        "/companies/company-profile/company-address",
        {
          params: {
            ...(id && { branch_id: id }),
            ...(currentCompanyId && { company_id: currentCompanyId }),
          },
        }
      );

      return response.data;
    },
    enabled: permissions.VIEW,
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

  return (
    <>
      {permissions.VIEW && (
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
              title="العنوان الوطني"
              valid={!!companyAddress}
              secondTitle={
                permissions.UPDATE && (
                  <Button variant={"ghost"} onClick={handleEditClick}>
                    {mode === "Preview" ? (
                      <PencilLineIcon additionalClass="text-pink-600" />
                    ) : (
                      <EyeIcon />
                    )}
                  </Button>
                )
              }
            >
              <CanSeeContent canSee={permissions.VIEW}>
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
                    {permissions.UPDATE && companyAddress ? (
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
              </CanSeeContent>
            </FormFieldSet>
          )}
        </>
      )}
    </>
  );
};

export default NationalAddress;
