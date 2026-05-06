"use client";

import { EMPLOYEE_OPTIONS } from "../constants";

export default function EmployeeOptionsSection() {
  return (
    <section className="border border-border rounded-xl p-4 md:p-6">
      <p className="text-sm text-muted-foreground text-right mb-4">
        اضافات وخصومات لنظام الحضور
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EMPLOYEE_OPTIONS.map((option) => (
          <div
            key={option.id}
            className="border border-border rounded-lg min-h-14 px-4 py-3 text-right"
          >
            <p className="text-sm">{option.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{option.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
