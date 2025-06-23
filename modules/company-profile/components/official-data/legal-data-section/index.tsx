import { useModal } from "@/hooks/use-modal";
import FieldSetSecondTitle from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import InfoIcon from "@/public/icons/InfoIcon";
import { useLocale } from "next-intl";
import { useState } from "react";
import LegalDataPreview from "./legal-data-preview";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import MyRequests from "../official-data-section/my-requests";
import { Button } from "@/components/ui/button";
import LegalDataForm from "./legal-data-form";
import { SheetFormBuilder } from "@/modules/form-builder";
import { LegalDataReqFormEditConfig } from "./legal-data-req-form-edit-config";
import { LegalDataAddReqFormEditConfig } from "./legal-data-add-req-form-config";
import { CompanyLegalData } from "@/modules/company-profile/types/company";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/config/axios-config";
import { ServerSuccessResponse } from "@/types/ServerResponse";
import { Skeleton } from '@/components/ui/skeleton';

const LegalDataSection = ({
  currentCompanyId,
  id,
}: {
  currentCompanyId:string,
  id?: string;
}) => {

    const { data, isPending, isSuccess } = useQuery({
    queryKey: ["company-legal-data", id, currentCompanyId],
    queryFn: async () => {
      const response = await apiClient.get<ServerSuccessResponse<CompanyLegalData[]>>(
        "/companies/company-profile/company-legal-data",
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

  const companyLegalData = data?.payload ?? [];


  const local = useLocale();
  const isRTL = local === "ar";
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const [isOpenMyReq, handleOpenMyReq, handleCloseMyReq] = useModal();
  const [isOpenReqForm, handleOpenReqForm, handleCloseReqForm] = useModal();
  const [isOpenMyForm, handleOpenMyForm, handleCloseMyForm] = useModal();

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  const dropdownItems = [
    {
      label: "طلباتي",
      onClick: handleOpenMyReq,
    },
    {
      label: "طلب تعديل البيانات القانونية",
      onClick: handleOpenReqForm,
    },
    {
      label: "اضافة بيان قانوني",
      onClick: handleOpenMyForm,
    },
  ];


  return (
    <>
      {isPending && (
        <div className="border border-gray-500 rounded-2xl p-6 shadow-sm grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      )}

      {isSuccess &&  (
      <FormFieldSet
        title="البيانات القانونية"
        valid={
          !!companyLegalData &&
          companyLegalData.length > 0 &&
          companyLegalData.every((entry) =>
            Object.values(entry).every((value) => !!value)
          )
        }
        secondTitle={
          <FieldSetSecondTitle
            mode={"Preview"}
            handleEditClick={handleEditClick}
            dropdownItems={dropdownItems}
          />
        }
      >
        {!!companyLegalData && companyLegalData.length > 0 ? <>
        {mode === "Preview" ? (
          <LegalDataPreview companyLegalData={companyLegalData} />
        ) : (
          <LegalDataForm companyLegalData={companyLegalData} id={id} handleEditClick={handleEditClick} />
        )}
        </> :    
        <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
          <InfoIcon additionClass="text-orange-500 " />
          <p className="text-center px-5">يجب إكمال بيانات التسجيل</p>
        </div>
        }
      </FormFieldSet>
      )}

      <Sheet open={isOpenMyReq} onOpenChange={handleCloseMyReq}>
        <SheetContent
          side={isRTL ? "left" : "right"}
          className={`h-fit max-h-[100vh] overflow-scroll`}
        >
          <SheetHeader>
            <SheetTitle>طلباتي</SheetTitle>
          </SheetHeader>
          <MyRequests type="companyLegalDataUpdate" company_id={currentCompanyId} branch_id={id}  />
          <Button className="mt-6 w-full" onClick={handleCloseMyReq}>
            الرجوع
          </Button>
        </SheetContent>
      </Sheet>

        <SheetFormBuilder
          config={LegalDataReqFormEditConfig({companyLegalData, company_id:currentCompanyId,id})}
          isOpen={isOpenReqForm}
          onOpenChange={handleCloseReqForm}
        />

        <SheetFormBuilder
          config={LegalDataAddReqFormEditConfig(id ,currentCompanyId)}
          isOpen={isOpenMyForm}
          onOpenChange={handleCloseMyForm}
        />
    </>
  );
};

export default LegalDataSection;
