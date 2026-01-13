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
import { Skeleton } from "@/components/ui/skeleton";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import SetLegalDataForm from "./set-legal-data";
import AddLegalDataSheet from "./set-legal-data/AddLegalDataSheet";

const LegalDataSection = ({
  currentCompanyId,
  id,
}: {
  currentCompanyId: string;
  id?: string;
}) => {
  const { can } = usePermissions();
  const { data, isPending, isSuccess, refetch } = useQuery({
    queryKey: ["company-legal-data", id, currentCompanyId],
    queryFn: async () => {
      const response = await apiClient.get<
        ServerSuccessResponse<CompanyLegalData[]>
      >("/companies/company-profile/company-legal-data", {
        params: {
          ...(id && { branch_id: id }),
          ...(currentCompanyId && { company_id: currentCompanyId }),
        },
      });

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

  // add legal data sheet
  const [
    isOpenAddLegalDataSheet,
    handleOpenAddLegalDataSheet,
    handleCloseAddLegalDataSheet,
  ] = useModal();

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  return (
    <>
      {isPending && (
        <div className="border border-gray-500 rounded-2xl p-6 shadow-sm grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-10" />
          ))}
        </div>
      )}

      {isSuccess && (
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
              settingsBtn={{
                items: [
                  {
                    title: "طلباتي",
                    onClick: handleOpenMyReq,
                  },
                  {
                    title: "طلب تعديل البيانات القانونية",
                    onClick: handleOpenReqForm,
                  },
                  {
                    title: "اضافة بيان قانوني",
                    onClick: () => {
                      handleOpenAddLegalDataSheet();
                    },
                  },
                ],
                disabledEdit: !can([
                  PERMISSIONS.companyProfile.legalData.update,
                ]),
              }}
            />
          }
        >
          {!!companyLegalData && companyLegalData.length > 0 ? (
            <>
              {mode === "Preview" ? (
                <>
                  <LegalDataPreview companyLegalData={companyLegalData} />
                </>
              ) : (
                <SetLegalDataForm
                  initialData={{
                    data: companyLegalData.map((item) => ({
                      id: item.id,
                      registration_type_id: `${item.registration_type_id}_${item.registration_type_type}`,
                      registration_type: item.registration_type,
                      registration_number: item.registration_number || "",
                      start_date: item.start_date,
                      end_date: item.end_date,
                      files:
                        item.file?.map((file) =>
                          typeof file === "string" ? { url: file } : file
                        ) || [],
                    })),
                  }}
                  mode="edit"
                  onCancel={handleEditClick}
                  onSuccess={() => {
                    refetch();
                  }}
                />
                // <LegalDataForm
                //   companyLegalData={companyLegalData}
                //   id={id}
                //   handleEditClick={handleEditClick}
                // />
              )}
            </>
          ) : (
            <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
              <InfoIcon additionClass="text-orange-500 " />
              <p className="text-center px-5">يجب إكمال بيانات التسجيل</p>
            </div>
          )}
          <AddLegalDataSheet
            open={isOpenAddLegalDataSheet}
            onOpenChange={handleCloseAddLegalDataSheet}
            companyId={currentCompanyId}
            branchId={id}
            onSuccess={() => {
              refetch();
            }}
          />
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
          <MyRequests
            type="companyLegalDataUpdate"
            company_id={currentCompanyId}
            branch_id={id}
          />
          <Button className="mt-6 w-full" onClick={handleCloseMyReq}>
            الرجوع
          </Button>
        </SheetContent>
      </Sheet>

      <SheetFormBuilder
        config={LegalDataReqFormEditConfig({
          companyLegalData,
          company_id: currentCompanyId,
          id,
        })}
        isOpen={isOpenReqForm}
        onOpenChange={handleCloseReqForm}
      />

      <SheetFormBuilder
        config={LegalDataAddReqFormEditConfig(id, currentCompanyId)}
        isOpen={isOpenMyForm}
        onOpenChange={handleCloseMyForm}
      />
    </>
  );
};

export default LegalDataSection;
