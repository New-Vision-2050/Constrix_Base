'use client'
import React, { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/modules/table/components/ui/input";
import { useAttendance } from "../context/AttendanceContext";

interface AttendanceDateSelectorProps {
  locale?: 'ar' | 'en'; // To specify the language
}

const AttendanceDateSelector: React.FC<AttendanceDateSelectorProps> = ({
  locale = "ar", // Default to Arabic
}) => {
  const { startDate, setStartDate, endDate, setEndDate } = useAttendance();
  
  // Estado local para las fechas en formato string
  const [startDateStr, setStartDateStr] = useState<string>("");
  const [endDateStr, setEndDateStr] = useState<string>("");

  // Formatear fecha como YYYY-MM-DD para los inputs HTML nativos
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Actualizar los campos de texto cuando cambian las fechas en el contexto
  useEffect(() => {
    setStartDateStr(formatDateForInput(startDate));
    setEndDateStr(formatDateForInput(endDate));
  }, [startDate, endDate]);

  // Manejar cambios en el campo de fecha inicial
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setStartDateStr(dateValue);
    
    if (dateValue) {
      const newDate = new Date(dateValue);
      // Evitar actualizaciones cuando el formato no es válido
      if (!isNaN(newDate.getTime())) {
        setStartDate(newDate);
      }
    } else {
      // Si se borra el campo, establecer fecha a null
      setStartDate(null);
    }
  };

  // Manejar cambios en el campo de fecha final
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    setEndDateStr(dateValue);
    
    if (dateValue) {
      const newDate = new Date(dateValue);
      // Evitar actualizaciones cuando el formato no es válido
      if (!isNaN(newDate.getTime())) {
        setEndDate(newDate);
      }
    } else {
      // Si se borra el campo, establecer fecha a null
      setEndDate(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Selector de fecha inicial */}
      <div className="relative" dir="rtl">
        <label
          htmlFor="start-date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right"
        >
          {locale === 'ar' ? "تاريخ البداية" : "Start Date"}
        </label>
        <div className="relative">
          <Input
            id="start-date"
            type="date"
            value={startDateStr}
            onChange={handleStartDateChange}
            className="w-full text-right pl-10 pr-4"
            style={{ direction: "rtl" }}
            dir="rtl"
          />
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Selector de fecha final */}
      <div className="relative" dir="rtl">
        <label
          htmlFor="end-date"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-right"
        >
          {locale === 'ar' ? "تاريخ النهاية" : "End Date"}
        </label>
        <div className="relative">
          <Input
            id="end-date"
            type="date"
            value={endDateStr}
            onChange={handleEndDateChange}
            className="w-full text-right pl-10 pr-4"
            style={{ direction: "rtl" }}
            dir="rtl"
          />
          <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceDateSelector;
