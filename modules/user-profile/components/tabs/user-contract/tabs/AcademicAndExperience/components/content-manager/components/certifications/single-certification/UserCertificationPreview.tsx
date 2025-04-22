import { Certification } from "@/modules/user-profile/types/Certification";
import PreviewTextField from "../../../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = { certification: Certification };
export default function UserCertificationPreview({ certification }: PropsT) {
  const t = useTranslations("AcademicExperience");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("AuthorityName")}
          value={certification?.professional_bodie_name ?? ""}
          valid={Boolean(certification?.professional_bodie_name)}
          type="select"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("AccreditationName")}
          value={certification?.accreditation_name ?? ""}
          valid={Boolean(certification?.accreditation_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("AccreditationNumber")}
          value={certification?.accreditation_number ?? ""}
          valid={Boolean(certification?.accreditation_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("AccreditationDegree")}
          value={certification?.accreditation_degree ?? ""}
          valid={Boolean(certification?.accreditation_degree)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CertificateAcquisitionDate")}
          value={certification?.date_obtain ?? ""}
          valid={Boolean(certification?.date_obtain)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CertificateExpiryDate")}
          value={certification?.date_end ?? ""}
          valid={Boolean(certification?.date_end)}
          type="date"
        />
      </div>
    </div>
  );
}
