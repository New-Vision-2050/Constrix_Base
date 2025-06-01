import { AdminRequest } from "@/types/admin-request";
import { format, parse } from "date-fns";
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

const RequestHistory = ({request}:{request: AdminRequest | null}) => {

    const parsedDate = parse(request?.created_at ?? "", 'yyyy-MM-dd HH:mm:ss', new Date());
    const formatted = format(parsedDate, 'yyyy/MM/dd hh:mma');
  
  const operationsData = [
    {
      id: 1,
      type: request?.action,
      performedBy: request?.user_name,
      date: formatted,
      notes: request?.notes,
    },
  ];

  return (  <div className={`w-full overflow-x-auto`}>
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
          {operationsData.map((operation) => (
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

export default RequestHistory;
