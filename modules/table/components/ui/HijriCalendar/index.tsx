import * as React from "react";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
// import arabic_en from "react-date-object/locales/arabic_en";
import { Calendar } from 'react-multi-date-picker'
import { cn } from "@/lib/utils";
import "./style.css"; // or use custom styles

export type CalendarProps = React.ComponentProps<typeof Calendar>;

function HijriCalendar({
  className,
   showOtherDays = true,
  ...props
}: CalendarProps) {
  let newCal= {...arabic,
    getMonthLengths(isLeap) {
    //Fix calendar date
      return [30,29,30,29,30,29,30,29,isLeap?30:29,29,30,isLeap?30:29];
    }}
  return (
    <Calendar
      showOtherDays={showOtherDays}
      highlightToday
      calendar={newCal}
      locale={arabic_ar}
      className={cn("custom-hijri-calendar" , className)}
      weekStartDayIndex={1}
      weekDays={[
        "سبت","أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"
      ]}
      autoFocus
      editable={false}
      {...props}
    />
  );
}
HijriCalendar.displayName = "HijriCalendar";

export { HijriCalendar };
