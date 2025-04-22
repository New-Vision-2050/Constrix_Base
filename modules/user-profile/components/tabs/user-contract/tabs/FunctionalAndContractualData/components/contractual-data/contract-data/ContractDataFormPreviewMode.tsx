import { Contract } from "@/modules/user-profile/types/Contract";
import PreviewTextField from "../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = {
  contract?: Contract | undefined;
};
export default function ContractDataFormPreviewMode({ contract }: PropsT) {
  const t = useTranslations("ContractData");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("ContractNumber")}
          value={contract?.contract_number ?? ""}
          valid={Boolean(contract?.contract_number)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("CommencementDate")}
          value={contract?.commencement_date ?? ""}
          valid={Boolean(contract?.commencement_date)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("StartDate")}
          value={contract?.start_date ?? ""}
          valid={Boolean(contract?.start_date)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("ContractDuration")}
          value={contract?.contract_duration ?? ""}
          valid={Boolean(contract?.contract_duration)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("NoticePeriod")}
          value={contract?.notice_period?.toString() ?? ""}
          valid={Boolean(contract?.notice_period)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("ProbationPeriod")}
          value={contract?.probation_period?.toString() ?? ""}
          valid={Boolean(contract?.probation_period)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("NatureOfWork")}
          value={contract?.nature_work ?? ""}
          valid={Boolean(contract?.nature_work)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("WorkingHoursType")}
          value={contract?.type_working_hours ?? ""}
          valid={Boolean(contract?.type_working_hours)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("WeeklyWorkingHours")}
          value={contract?.working_hours?.toString() ?? ""}
          valid={Boolean(contract?.working_hours?.toString())}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("AnnualLeaveDays")}
          value={contract?.annual_leave?.toString() ?? ""}
          valid={Boolean(contract?.annual_leave)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("WorkLocation")}
          value={contract?.country_name ?? ""}
          valid={Boolean(contract?.country_name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("RightToTerminateDuringProbation")}
          value={contract?.right_terminate ?? ""}
          valid={Boolean(contract?.right_terminate)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("AttachContract")}
          value={
            contract?.contract_number
              ? contract?.contract_number + " file "
              : ""
          }
          valid={Boolean(contract?.file_url)}
          required
        />
      </div>
    </div>
  );
}
