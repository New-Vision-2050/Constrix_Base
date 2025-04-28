import VerticalBtnsList from "@/components/shared/VerticalList";
import { GetFinancialDataSections } from "../constants/financial-data-sections";
import { useFinancialDataCxt } from "../context/financialDataCxt";

export default function FinancialDataEntryPoint() {
  const { handleChangeActiveSection, activeSection } = useFinancialDataCxt();

  return (
    <div className="flex gap-8">
      <VerticalBtnsList
        items={GetFinancialDataSections({
          handleChangeActiveSection: (section) =>
            handleChangeActiveSection(section),
        })}
      />
      <div className="p-4 flex-grow gap-8  min-h-[400px] transition-all duration-300">{activeSection?.content}</div>
    </div>
  );
}
