import { Contract } from "@/modules/user-profile/types/Contract";
import PreviewTextField from "../../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../../context";
import { useTranslations } from "next-intl";

type PropsT = {
  contract?: Contract | undefined;
};
export default function ContractDataFormPreviewMode({ contract }: PropsT) {
  const { handleRefetchContractData } = useFunctionalContractualCxt();
  const t = useTranslations("UserProfile.tabs.financialData.workContract");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("contractNumberLabel")}
          value={contract?.contract_number ?? ""}
          valid={Boolean(contract?.contract_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("commencementDateLabel")}
          value={contract?.commencement_date ?? ""}
          valid={Boolean(contract?.commencement_date)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("startDateLabel")}
          value={contract?.start_date ?? ""}
          valid={Boolean(contract?.start_date)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("contractDurationLabel")}
          value={`${contract?.contract_duration ?? ""} ${
            contract?.contract_duration_unit?.name ?? ""
          }`}
          valid={Boolean(contract?.contract_duration)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("noticePeriodLabel")}
          value={`${(contract?.notice_period ?? "")?.toString()} ${
            contract?.notice_period_unit?.name ?? ""
          }`}
          valid={Boolean(contract?.notice_period)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("probationPeriodLabel")}
          value={`${(contract?.probation_period ?? "")?.toString()} ${
            contract?.probation_period_unit?.name ?? ""
          }`}
          valid={Boolean(contract?.probation_period)}
        />
      </div>

      {/* <div className="p-2">
        <PreviewTextField
          label="طبيعة العمل"
          value={contract?.nature_work?.name ?? ""}
          valid={Boolean(contract?.nature_work)}
        />
      </div> */}

      <div className="p-2">
        <PreviewTextField
          label={t("typeWorkingHourLabel")}
          value={contract?.type_working_hour?.name ?? ""}
          valid={Boolean(contract?.type_working_hour)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("workingHoursLabel")}
          value={`${(contract?.working_hours ?? "")?.toString()} ${t("hourLabel")}`}
          valid={Boolean(contract?.working_hours?.toString())}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("annualLeaveLabel")}
          value={`${(contract?.annual_leave ?? "")?.toString()} ${t("dayLabel")}`}
          valid={Boolean(contract?.annual_leave)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("workPlaceLabel")}
          value={contract?.state_name ?? ""}
          valid={Boolean(contract?.state_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("rightTerminateLabel")}
          value={contract?.right_terminate?.name ?? ""}
          valid={Boolean(contract?.right_terminate)}
        />
      </div>
      {Array.isArray(contract?.files) && contract?.files?.length > 0 ? (
        contract?.files?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefetchContractData();
              }}
              valid={Boolean(media?.name)}
              label={t("attachContractLabel")}
              value={media?.name ?? "---"}
              type={media?.type == "image" ? "image" : "pdf"}
              fileUrl={media?.url}
            />
          </div>
        ))
      ) : (
        <div className="p-2">
          <PreviewTextField
            valid={false}
            label={t("attachContractLabel")}
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
