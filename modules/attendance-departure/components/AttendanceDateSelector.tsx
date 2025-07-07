'use client'
import React, { useState } from "react";
import { CalendarDaysIcon, ChevronDownIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAttendance } from "../context/AttendanceContext";

interface AttendanceDateSelectorProps {
  locale?: 'ar' | 'en'; // To specify the language
}

const AttendanceDateSelector: React.FC<AttendanceDateSelectorProps> = ({
  locale = "ar", // Default to Arabic
}) => {
  const { startDate, setStartDate, endDate, setEndDate } = useAttendance();
  
  // State to track which calendar is open (from, to, or none)
  const [openCalendar, setOpenCalendar] = useState<'from' | 'to' | null>(null);

  // Format dates for display
  const formatDate = (date: Date | null) => {
    if (!date) return locale === "ar" ? "من" : "From";
    return date.toLocaleDateString(
      locale === "ar" ? "ar-EG" : "en-US",
      { year: "numeric", month: "2-digit", day: "2-digit" }
    );
  };

  const fromDisplayLabel = formatDate(startDate);
  const toDisplayLabel = formatDate(endDate);

  // Handle opening and closing the calendar dropdowns
  const handleToggleCalendar = (calendarType: 'from' | 'to') => {
    if (openCalendar === calendarType) {
      setOpenCalendar(null);
    } else {
      setOpenCalendar(calendarType);
    }
  };

  return (
    <div className="flex items-center gap-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* From Date Selector */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={() => handleToggleCalendar('from')}
          className="flex items-center justify-between min-w-[176px] h-10 rounded-xl bg-[#18123A] border border-[#3C3474] px-4 text-lg text-gray-200 focus:outline-none"
          style={{ fontWeight: 400 }}
        >
          <ChevronDownIcon size={22} className={locale === 'ar' ? "ml-2" : "mr-2"} />
          <span className="flex-1 text-center">{fromDisplayLabel}</span>
          <CalendarDaysIcon size={22} className={locale === 'ar' ? "mr-2" : "ml-2"} />
        </button>
        {openCalendar === 'from' && (
          <div style={{ position: 'absolute', top: '110%', right: locale === 'ar' ? 0 : 'auto', left: locale === 'ar' ? 'auto' : 0, zIndex: 1000, direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
            <DatePicker
              selected={startDate || undefined}
              onChange={(date) => {
                setStartDate(date as Date);
                setOpenCalendar(null);
              }}
              maxDate={endDate || undefined}
              locale={locale}
              inline
              calendarStartDay={locale === 'ar' ? 6 : 0}
            />
          </div>
        )}
      </div>

      {/* To Date Selector */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={() => handleToggleCalendar('to')}
          className="flex items-center justify-between min-w-[176px] h-10 rounded-xl bg-[#18123A] border border-[#3C3474] px-4 text-lg text-gray-200 focus:outline-none"
          style={{ fontWeight: 400 }}
        >
          <ChevronDownIcon size={22} className={locale === 'ar' ? "ml-2" : "mr-2"} />
          <span className="flex-1 text-center">{toDisplayLabel}</span>
          <CalendarDaysIcon size={22} className={locale === 'ar' ? "mr-2" : "ml-2"} />
        </button>
        {openCalendar === 'to' && (
          <div style={{ position: 'absolute', top: '110%', right: locale === 'ar' ? 0 : 'auto', left: locale === 'ar' ? 'auto' : 0, zIndex: 1000, direction: locale === 'ar' ? 'rtl' : 'ltr' }}>
            <DatePicker
              selected={endDate || undefined}
              onChange={(date) => {
                setEndDate(date as Date);
                setOpenCalendar(null);
              }}
              minDate={startDate || undefined}
              locale={locale}
              inline
              calendarStartDay={locale === 'ar' ? 6 : 0}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDateSelector;
