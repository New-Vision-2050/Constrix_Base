import { Button } from "@/components/ui/button";
import FormFieldSet from "../../../../../components/FormFieldSet";
import PencilLineIcon from "@/public/icons/pencil-line";
import PdfViewer from "./PdfViewer";
import UploadCvDialog from "./UploadCvDialog";
import { useState } from "react";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { useTranslations } from "next-intl";

export default function UserCV() {
  const [open, setOpen] = useState(false);
  const { userCV } = useUserAcademicTabsCxt();
  const t = useTranslations("AcademicExperience");
  const tContract = useTranslations("UserContractTabs");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-bold text-gray-700">
        {tContract("FunctionalContractualData")} {/* Assuming this title is correct */}
      </p>
      <FormFieldSet
        title={t("CV")}
        secondTitle={
          <Button variant={"ghost"} onClick={() => setOpen(true)}>
            <PencilLineIcon additionalClass="text-pink-600" />
          </Button>
        }
      >
        {userCV?.files ? (
          <PdfViewer src={userCV?.files ?? ""} />
        ) : (
          <NoDataFounded
            title={t("NoDataFound")}
            subTitle={t("NoCVData")}
          />
        )}
      </FormFieldSet>
      <UploadCvDialog open={open} setOpen={setOpen} />
    </div>
  );
}
