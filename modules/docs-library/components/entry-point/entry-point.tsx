import { FileText } from "lucide-react";
import { StatisticsCardData } from "../statistics-cards/docs-company-statistics-card";
import CompanyDocsStatisticsCard from "../statistics-cards/docs-company-statistics-card/StatisticsCard";

const documentStats: StatisticsCardData = {
  title: "عدد المستندات الشركة",
  mainValue: 27,
  mainLabel: "مستند",
  secondaryValue: "160 MB",
  comparison: {
    leftValue: 120,
    leftLabel: "المساحة المتبقية",
    rightValue: 40,
    rightLabel: "المساحة المستهلكة",
    unit: "MB",
  },
  icon: <FileText className="w-6 h-6 text-blue-400" />,
};

export default function DocsLibraryEntryPoint() {
  return (
    <div>
      <CompanyDocsStatisticsCard data={documentStats} />
      <CompanyDocsStatisticsCard isLoading={true} />
      <CompanyDocsStatisticsCard error="فشل في تحميل البيانات" />
    </div>
  );
}
