import ContractStatusHeader from "./header-section";
import ContractStatusCardContent from "./contract-card-content";
import { ProfileWidgetContract } from "@/modules/user-profile/types/profile-widgets";

type PropsT = {
  contractData?: ProfileWidgetContract;
};

export default function ContractStatusCard({ contractData }: PropsT) {
  return (
    <div className="flex min-h-[177px] w-[250px] flex-col justify-between bg-sidebar shadow-md rounded-lg p-4">
      {/* Header Section */}
      <ContractStatusHeader contractData={contractData}/>

      {/* Contract Details */}
      <ContractStatusCardContent contractData={contractData} />
    </div>
  );
}
