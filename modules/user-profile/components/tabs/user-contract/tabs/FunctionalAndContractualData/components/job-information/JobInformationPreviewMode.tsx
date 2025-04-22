import PreviewTextField from "../../../components/previewTextField";
import { useTranslations } from "next-intl";

export default function JobInformationPreviewMode() {
  const t = useTranslations("JobInformation");
  const tCompanyUser = useTranslations("CompanyUserForm");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("Branch")}
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("Department")}
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("Section")}
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("JobType")}
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tCompanyUser("JobTitle")}
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("JobNumber")}
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>
    </div>
  );
}
