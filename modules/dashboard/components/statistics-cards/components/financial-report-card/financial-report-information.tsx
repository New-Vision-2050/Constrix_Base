export default function FinancialReportInformation() {
  // declare and define helper vars
  const totalAmount = "4000 رس";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          التقرير المالي
        </h3>
        <p className="text-sm text-gray-500">المستحق الشهري</p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
          {totalAmount}
        </h3>
        <div className="flex gap-1 items-center">
          <span className="w-3 h-3 bg-green-700 rounded-full" />
          <span className="px-2 py-1 text-sm font-medium text-green-700 rounded-md">
            +18.4%
          </span>
        </div>
      </div>
    </div>
  );
}
