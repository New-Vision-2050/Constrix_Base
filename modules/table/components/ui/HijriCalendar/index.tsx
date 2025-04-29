import * as React from "react";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
// import arabic_en from "react-date-object/locales/arabic_en";
import { Calendar, CalendarProps, DateObject } from 'react-multi-date-picker'
import { cn } from "@/lib/utils";
import "./style.css"; // or use custom styles

type DateType = Date | number | string | DateObject
const newCalendar = {
  ...arabic,
  getMonthLengths(isLeap: boolean) {
    //Fix calendar date
    return [30, 29, 30, 29, 30, 29, 30, 29, isLeap ? 30 : 29, 29, 30, isLeap ? 30 : 29]
  }
}

function HijriCalendar({
    className,
    showOtherDays = true,
    highlightToday = true,
    ...props
}: CalendarProps) {

  return (
    <Calendar
      showOtherDays={showOtherDays}
      highlightToday={highlightToday}
      calendar={newCalendar}
      locale={arabic_ar}
      className={cn("custom-hijri-calendar" , className)}
      weekStartDayIndex={1}
      weekDays={[
        "سبت","أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"
      ]}
      autoFocus
      {...props}
    />
  );
}
HijriCalendar.displayName = "HijriCalendar";

export { HijriCalendar };


export const getHijriDate = (date: DateType) => {
  let dateObject = new DateObject({
    date: date,
    calendar: newCalendar,
    locale: arabic_ar
  })
  return dateObject?.toString() ?? undefined
}