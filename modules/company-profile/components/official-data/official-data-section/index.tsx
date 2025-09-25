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
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

const OfficialDataSection = ({
  officialData,
  currentCompanyId,
  id,
}: {
  officialData: officialData;
  currentCompanyId: string;
  id?: string;
}) => {
  const local = useLocale();
  const isRTL = local === "ar";
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  const { can } = usePermissions();

  const [isOpenReqForm, handleOpenReqForm, handleCloseReqForm] = useModal();
  const [isOpenMyReq, handleOpenMyReq, handleCloseMyReq] = useModal();

  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  console.log('officialData101505', officialData)
  return (
    <>
      <FormFieldSet
        title="البيانات الرسمية"
        valid={Object.values(officialData).every((value) =>
          Array.isArray(value) ? value.length > 0 : Boolean(value)
        )}
        secondTitle={
          <FieldSetSecondTitle
            mode={mode}
            handleEditClick={handleEditClick}
            settingsBtn={{
              items: [
                {
                  title: "طلباتي",
                  onClick: handleOpenMyReq,
                },
                {
                  title: "طلب تعديل البيانات الرسمية",
                  onClick: handleOpenReqForm,
                },
              ],
              disabledEdit: !can([
                PERMISSIONS.companyProfile.officialData.update,
              ]),
            }}
          />
        }
      >
        <br />
        {mode === "Preview" ? (
          <OfficialDataPreview officialData={officialData} />
        ) : (
          <OfficialDataForm
            officialData={officialData}
            id={id}
            handleEditClick={handleEditClick}
          />
        )}
      </FormFieldSet>
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
  );
};

export default OfficialDataSection;
