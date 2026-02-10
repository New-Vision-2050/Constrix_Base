import { Contract } from "@/modules/user-profile/types/Contract";
import PreviewTextField from "../../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../../context";

type PropsT = {
  contract?: Contract | undefined;
};
export default function ContractualRelationshipFormPreviewMode({ contract }: PropsT) {
  const { handleRefetchContractData } = useFunctionalContractualCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="العلاقه التعاقديه "
          value={contract?.contractual_relationship_type?.name ?? ""}
          valid={Boolean(contract?.contractual_relationship_type)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="اسم صاحب العمل"
          value={contract?.employment_name ?? ""}
          valid={Boolean(contract?.employment_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="رقم السجل"
          value={contract?.registration_number ?? ""}
          valid={Boolean(contract?.registration_number)}
        />
      </div>

    </div>
  );
}
