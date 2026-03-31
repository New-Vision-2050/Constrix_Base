import { Contract } from "@/modules/user-profile/types/Contract";
import PreviewTextField from "../../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../../context";
import { useTranslations } from "next-intl";

type PropsT = {
  contract?: Contract | undefined;
};
export default function ContractualRelationshipFormPreviewMode({ contract }: PropsT) {
  const { handleRefetchContractData } = useFunctionalContractualCxt();
  const tContractual = useTranslations("UserProfile.nestedTabs.contractualRelationship");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={tContractual("title")}
          value={contract?.contractual_relationship_type?.name ?? ""}
          valid={Boolean(contract?.contractual_relationship_type)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tContractual("employerName")}
          value={contract?.employment_name ?? ""}
          valid={Boolean(contract?.employment_name)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={tContractual("recordNumber")}
          value={contract?.registration_number ?? ""}
          valid={Boolean(contract?.registration_number)}
        />
      </div>

    </div>
  );
}
