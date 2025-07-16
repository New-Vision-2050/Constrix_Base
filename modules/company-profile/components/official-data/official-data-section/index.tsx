"use client";

import FieldSetSecondTitle from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import FormFieldSet from "@/modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import OfficialDataPreview from "./official-data-preview";
import OfficialDataForm from "./official-data-form";
import { SheetFormBuilder } from "@/modules/form-builder";
import { ReqOfficialDataEdit } from "./req-official-data-edit";
import { useState } from "react";
import { useModal } from "@/hooks/use-modal";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLocale } from "next-intl";
import MyRequests from "./my-requests";
import { Button } from "@/components/ui/button";
import { officialData } from "@/modules/company-profile/types/company";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

const OfficialDataSection = ({
  officialData,
  currentCompanyId,
  id,
}: {
  officialData: officialData;
  currentCompanyId: string;
  id?: string;
}) => {
  const permissions = can([PERMISSION_ACTIONS.VIEW, PERMISSION_ACTIONS.UPDATE] , PERMISSION_SUBJECTS.COMPANY_PROFILE_OFFICIAL_DATA) as {
    VIEW: boolean;
    UPDATE: boolean;
  }
  
  const local = useLocale();
  const isRTL = local === "ar";
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const [isOpenReqForm, handleOpenReqForm, handleCloseReqForm] = useModal();
  const [isOpenMyReq, handleOpenMyReq, handleCloseMyReq] = useModal();

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  const dropdownItems = [
    {
      label: "طلباتي",
      onClick: handleOpenMyReq,
    },
    {
      label: "طلب تعديل البيانات الرسمية",
      onClick: handleOpenReqForm,
    },
  ];
  return (
    <>
      <FormFieldSet
        title="البيانات الرسمية"
        valid={Object.values(officialData).every((value) =>
          Array.isArray(value) ? value.length > 0 : Boolean(value)
        )}
        secondTitle={
          <>
            {permissions.UPDATE && (
              <>
                <FieldSetSecondTitle
                  mode={mode}
                  handleEditClick={handleEditClick}
                  dropdownItems={dropdownItems}
                />
              </>
            )}
          </>
        }
      >
        <br />
        <CanSeeContent canSee={permissions.VIEW}>
          {mode === "Preview" ? (
            <OfficialDataPreview officialData={officialData} />
          ) : (
            <OfficialDataForm
              officialData={officialData}
              id={id}
              handleEditClick={handleEditClick}
            />
          )}
        </CanSeeContent>
      </FormFieldSet>
      {permissions.UPDATE && (
        <>
          <SheetFormBuilder
            config={ReqOfficialDataEdit({
              officialData,
              company_id: currentCompanyId,
              id,
            })}
            isOpen={isOpenReqForm}
            onOpenChange={handleCloseReqForm}
          />
          <Sheet open={isOpenMyReq} onOpenChange={handleCloseMyReq}>
            <SheetContent
              side={isRTL ? "left" : "right"}
              className={`h-fit max-h-[100vh] overflow-scroll`}
            >
              <SheetHeader>
                <SheetTitle>طلباتي</SheetTitle>
              </SheetHeader>
              <MyRequests
                type="companyOfficialDataUpdate"
                company_id={currentCompanyId}
                branch_id={id}
              />
              <Button className="mt-6 w-full" onClick={handleCloseMyReq}>
                الرجوع
              </Button>
            </SheetContent>
          </Sheet>
        </>
      )}
    </>
  );
};

export default OfficialDataSection;
