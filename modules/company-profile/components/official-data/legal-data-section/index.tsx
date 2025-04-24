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

const LegalDataSection = ({
  companyLegalData = [],
  id,
}: {
  companyLegalData: CompanyLegalData[];
  id?: string;
}) => {
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
      label: "طلب تعديل البيانات الرسمية",
      onClick: handleOpenReqForm,
    },
    {
      label: "اضافة بيان قانوني",
      onClick: handleOpenMyForm,
    },
  ];

  return (
    <>
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
        {mode === "Preview" ? (
          <>
            {!!companyLegalData && companyLegalData.length > 0 ? (
              <LegalDataPreview companyLegalData={companyLegalData} />
            ) : (
              <div className="mx-auto w-64 rounded-md flex flex-col bg-background items-center justify-center gap-3 p-3">
                <InfoIcon additionClass="text-orange-500 " />
                <p className="text-center px-5">يجب إكمال بيانات التسجيل</p>
              </div>
            )}
          </>
        ) : (
          <LegalDataForm companyLegalData={companyLegalData} id={id} />
        )}
      </FormFieldSet>

      <Sheet open={isOpenMyReq} onOpenChange={handleCloseMyReq}>
        <SheetContent
          side={isRTL ? "left" : "right"}
          className={`h-fit max-h-[100vh] overflow-scroll`}
        >
          <SheetHeader>
            <SheetTitle>طلباتي</SheetTitle>
          </SheetHeader>
          <MyRequests />
          <Button className="mt-6 w-full" onClick={handleCloseMyReq}>
            الرجوع
          </Button>
        </SheetContent>

        <SheetFormBuilder
          config={LegalDataReqFormEditConfig(companyLegalData, id)}
          isOpen={isOpenReqForm}
          onOpenChange={handleCloseReqForm}
        />

        <SheetFormBuilder
          config={LegalDataAddReqFormEditConfig(id)}
          isOpen={isOpenMyForm}
          onOpenChange={handleCloseMyForm}
        />
      </Sheet>
    </>
  );
};

export default LegalDataSection;
