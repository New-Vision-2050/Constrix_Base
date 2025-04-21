"use client";

import { AlertCircle } from "lucide-react";

const EmployeeCard = () => {
  return (
    <div className="flex flex-col grow w-full bg-sidebar rounded-lg p-5 min-h-32">
      <div className="flex gap-4">
        الموظفين <AlertCircle className="text-yellow-500 mb-2" />
      </div>
      <div className="grow flex items-center justify-center">
        <p className="text-muted-foreground text-sm">لا يوجد بيانات</p>
      </div>
    </div>
  );
};

export default EmployeeCard;
