import FinancialReportChart from "./financial-report-chart";
import FinancialReportInformation from "./financial-report-information";

export default function FinancialReportCard() {
  return (
    <div className="bg-sidebar min-h-[177px] w-[250px] min-w-[250px] flex-shrink-0 overflow-hidden shadow-md rounded-lg p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <FinancialReportInformation />
        </div>
        <div className="shrink-0 overflow-hidden">
          <FinancialReportChart />
        </div>
      </div>
    </div>
  );
}
