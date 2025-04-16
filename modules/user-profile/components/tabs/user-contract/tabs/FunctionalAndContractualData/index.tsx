import VerticalBtnsList from "@/components/shared/VerticalList";
import { FunctionalContractualList } from "./constants/FunctionalContractualList";

export default function FunctionalAndContractualData() {
  return (
    <div className="flex gap-8">
      <VerticalBtnsList items={FunctionalContractualList} />
      <div className="p-4 flex-grow gap-8">
        Functional and contractual data manager
      </div>
    </div>
  );
}
