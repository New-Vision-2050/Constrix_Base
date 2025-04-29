import { Contract } from "@/modules/user-profile/types/Contract";
import PreviewTextField from "../../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../../context";

type PropsT = {
  contract?: Contract | undefined;
};
export default function ContractDataFormPreviewMode({ contract }: PropsT) {
  const { handleRefetchContractData } = useFunctionalContractualCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="رقم العقد"
          value={contract?.contract_number ?? ""}
          valid={Boolean(contract?.contract_number)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ المباشرة"
          value={contract?.commencement_date ?? ""}
          valid={Boolean(contract?.commencement_date)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ البدء"
          value={contract?.start_date ?? ""}
          valid={Boolean(contract?.start_date)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="مدة العقد"
          value={`${contract?.contract_duration ?? ""} ${
            contract?.contract_duration_unit?.name ?? ""
          }`}
          valid={Boolean(contract?.contract_duration)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="فترة الاشعار"
          value={`${(contract?.notice_period ?? "")?.toString()} ${
            contract?.notice_period_unit?.name ?? ""
          }`}
          valid={Boolean(contract?.notice_period)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="فترة التجربة"
          value={`${(contract?.probation_period ?? "")?.toString()} ${
            contract?.probation_period_unit?.name ?? ""
          }`}
          valid={Boolean(contract?.probation_period)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="طبيعة العمل"
          value={contract?.nature_work?.name ?? ""}
          valid={Boolean(contract?.nature_work)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="نوع ساعات العمل"
          value={contract?.type_working_hour?.name ?? ""}
          valid={Boolean(contract?.type_working_hour)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="ساعات العمل الاسبوعية"
          value={`${(contract?.working_hours ?? "")?.toString()} ساعة`}
          valid={Boolean(contract?.working_hours?.toString())}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="ايام الاجازات السنوية"
          value={`${(contract?.annual_leave ?? "")?.toString()} يوم`}
          valid={Boolean(contract?.annual_leave)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="مكان العمل"
          value={contract?.country_name ?? ""}
          valid={Boolean(contract?.country_name)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="حق الانهاء خلال فترة التجربة"
          value={contract?.right_terminate?.name ?? ""}
          valid={Boolean(contract?.right_terminate)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          mediaId={contract?.files?.id}
          fireAfterDeleteMedia={() => {
            handleRefetchContractData();
          }}
          valid={Boolean(contract?.files?.url)}
          label="ارفاق العرض"
          value={contract?.files?.name ?? "---"}
          type={contract?.files?.type == "image" ? "image" : "pdf"}
          fileUrl={contract?.files?.url ?? ""}
        />
      </div>
    </div>
  );
}
