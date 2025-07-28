import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface PermissionTableHeaderProps {
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
}

const PermissionTableHeader: React.FC<PermissionTableHeaderProps> = ({
  allSelected,
  onSelectAll
}) => {
  return (
    <thead>
      <tr>
        <th className="px-4 py-3 text-center text-sm font-medium">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={onSelectAll}
          /> 
        </th>
        <th className="px-4 py-3 text-right text-sm font-medium">الصلاحية</th>
        <th className="px-4 py-3 text-center text-sm font-medium">عرض</th>
        <th className="px-4 py-3 text-center text-sm font-medium">تعديل</th>
        <th className="px-4 py-3 text-center text-sm font-medium">حذف</th>
        <th className="px-4 py-3 text-center text-sm font-medium">إنشاء</th>
        <th className="px-4 py-3 text-center text-sm font-medium">تصدير</th>
        <th className="px-4 py-3 text-center text-sm font-medium">تنشيط</th>
        <th className="px-4 py-3 text-center text-sm font-medium">قائمة</th>
        <th className="px-4 py-3 text-center text-sm font-medium">العدد</th>
      </tr>
    </thead>
  );
};

export default PermissionTableHeader;
