import ContractStatusHeader from "./header-section";
import ContractStatusCardContent from "./contract-card-content";

export default function ContractStatusCard() {
  return (
    <div className="flex min-h-[177px] w-[250px] flex-col justify-between bg-sidebar shadow-md rounded-lg p-4">
      {/* Header Section */}
      <ContractStatusHeader />

      {/* Contract Details */}
      <ContractStatusCardContent />
    </div>
  );
}
