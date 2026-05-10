"use client";

import { EMPLOYEE_OPTIONS } from "../constants";

export default function AttendanceSettingsSection() {
  return (
    <section className="border border-border rounded-xl p-4 md:p-6">
      <p className="text-xl font-semibold text-right mb-6">
        اعدادات تسجيل الحضور والانصراف
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {EMPLOYEE_OPTIONS.map((option) => (
          <div
            key={option.id}
            className="border border-border rounded-lg min-h-[92px] px-4 py-3 text-right flex flex-col justify-center bg-background/20"
          >
            <p className="text-3xl font-semibold text-primary leading-none">
              {option.value}
            </p>
            <p className="text-sm text-muted-foreground mt-3">{option.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
