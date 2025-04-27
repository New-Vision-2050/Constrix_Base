import VerticalBtnsList from "@/components/shared/VerticalList";
import { GetFunctionalContractualList } from "../constants/FunctionalContractualList";
import { useFunctionalContractualCxt } from "../context";

export default function FunctionalAndContractualDataEntryPoint() {
  const { handleChangeActiveSection, activeSection } =
    useFunctionalContractualCxt();
  return (
    <div className="flex gap-8">
      <VerticalBtnsList
        items={GetFunctionalContractualList({
          handleChangeActiveSection: (section) =>
            handleChangeActiveSection(section),
        })}
      />
      <div className="p-4 flex-grow gap-8  min-h-[400px] transition-all duration-300">{activeSection?.content}</div>
    </div>
  );
}
