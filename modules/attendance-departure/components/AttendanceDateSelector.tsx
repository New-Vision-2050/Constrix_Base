'use client'
import React, { useState } from "react";
import { CalendarDaysIcon, ChevronDownIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AttendanceDateSelectorProps {
  label?: string;
  locale?: 'ar' | 'en'; // To specify the language
}

const AttendanceDateSelector: React.FC<AttendanceDateSelectorProps> = ({
  label = "تاريخ اليوم",
  locale = "ar", // Default to Arabic
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [open, setOpen] = useState(false);

  // Display the date based on the language
  let displayLabel = label;
  if (selectedDate) {
    displayLabel = selectedDate.toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      { year: "numeric", month: "2-digit", day: "2-digit" }
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        dir="rtl"
        className="flex items-center justify-between min-w-[176px] h-10 rounded-xl bg-[#18123A] border border-[#3C3474] px-4 text-lg text-gray-200 focus:outline-none"
        style={{ fontWeight: 400 }}
      >
        <ChevronDownIcon size={22} className="ml-2 text-gray-400" />
        <span className="flex-1 text-center">{displayLabel}</span>
        <CalendarDaysIcon size={22} className="mr-2 text-gray-400" />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '110%', right: 0, zIndex: 1000, direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date as Date);
              setOpen(false);
            }}
            locale={locale}
            inline
            calendarStartDay={locale === 'ar' ? 6 : 0}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceDateSelector;
