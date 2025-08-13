import { useFunctionalContractualCxt } from "../../context";
import ContractDataForm from "./contract-data";
import JobOfferForm from "./job-offer";

export default function ContractualDataTab() {
  const { userJobOffersData } = useFunctionalContractualCxt();

  return (
    <div className="p-4 flex-grow flex flex-col gap-12">
      <p className="text-lg font-bold">البيانات التعاقدية</p>
      <JobOfferForm offer={userJobOffersData} />
      <ContractDataForm />
    </div>
  );
}
