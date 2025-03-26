import FinancialReportChart from "./financial-report-chart";
import FinancialReportInformation from "./financial-report-information";

export default function FinancialReportCard() {
  return (
    <div className="bg-sidebar shadow-md rounded-lg p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <FinancialReportInformation />
        <FinancialReportChart />
      </div>
    </div>
  );
}
