import React from "react";

export default function NoDataState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="px-6 py-4 rounded-lg text-center">
        <p className="text-sm font-medium">قم بتحديد الفروع أولاً</p>
        <p className="text-xs mt-1 opacity-75">يجب اختيار الفروع من النموذج أولاً لتتمكن من تحديد مواقعها</p>
      </div>
    </div>
  );
}
