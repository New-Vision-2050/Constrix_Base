import React from "react";

interface Operation {
  id: number;
  type: string;
  performedBy: string;
  date: string;
  notes: string;
}

interface OperationsHistoryTableProps {
  operations: Operation[];
  className?: string;
}

const OperationsHistoryTable = ({
  operations,
  className = "",
}: OperationsHistoryTableProps) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-sidebar text-start">
            <th className="p-4 text-start font-normal">م</th>
            <th className="p-4 text-start font-normal">نوع العملية</th>
            <th className="p-4 text-start font-normal">تمت بواسطة</th>
            <th className="p-4 text-start font-normal">وقت العملية</th>
            <th className="p-4 text-start font-normal">ملاحظات</th>
          </tr>
        </thead>
        <tbody>
          {operations.map((operation) => (
            <tr key={operation.id} className="border border-gray-700">
              <td className="p-4 text-start">{operation.id}</td>
              <td className="p-4 text-start">{operation.type}</td>
              <td className="p-4 text-start">{operation.performedBy}</td>
              <td className="p-4 text-start">{operation.date}</td>
              <td className="p-4 text-start">{operation.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RequestHistory = () => {
  const operationsData = [
    {
      id: 1,
      type: "انشاء الطلب",
      performedBy: "العميل",
      date: "2024/04/22 01:30م",
      notes: "تعديل مدير الشركة",
    },
    {
      id: 2,
      type: "تعديل الطلب",
      performedBy: "الموظف",
      date: "2024/04/18 01:30م",
      notes: "الرجاء ارفاق الهوية",
    },
    {
      id: 3,
      type: "تاكيد الطلب",
      performedBy: "العميل",
      date: "2024/04/25 03:00م",
      notes: "تسجيل البيانات",
    },
    {
      id: 4,
      type: "معالجة الطلب",
      performedBy: "الموظف",
      date: "2024/04/29 10:00م",
      notes: "تحديث الفاتورة",
    },
  ];

  return <OperationsHistoryTable operations={operationsData} />;
};

export default RequestHistory;
