import FinancialDataEntryPoint from "./components/financial-data-entry-point";
import { FinancialDataCxtProvider } from "./context/financialDataCxt";

export default function FinancialBenefits() {
  return (
    <FinancialDataCxtProvider>
      <FinancialDataEntryPoint />
    </FinancialDataCxtProvider>
  );
}
