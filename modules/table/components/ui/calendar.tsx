import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ar , enUS} from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/modules/table/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
import { useLocale } from "next-intl";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  value,
  ...props
}: CalendarProps & { value: string; onChange: (date: string) => void }) {
  const [month, setMonth] = React.useState(() => value ? new Date(value): new Date() );
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  // Generate a range of years (start from 1990 to current year + 20)
  const startYear = 1990;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear + 21 - startYear }, (_, i) => startYear + i);

  // Handle input year
  const handleYearChange = (year: number) => {
    if (!isNaN(year)) {
      setMonth(new Date(year, month.getMonth(), 1));
      setPopoverOpen(false);
    }
  };

  const locale = useLocale();
  const isRtl = locale === "ar";
  // Set date-fns locale for DayPicker
  const dayPickerLocale = isRtl ? ar : enUS;

  // Arabic month names
  const monthNames = isRtl
    ? [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
      ]
    : [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
      ];

  // Helper to convert numbers to Arabic-Indic numerals
  const toArabicNumeral = (num: number) =>
    String(num).replace(/[0-9]/g, d => String.fromCharCode(d.charCodeAt(0) + 0x0660 - 0x0030));

  // Handle day selection and propagate value
  const handleDaySelect = (selected: Date | undefined) => {
    if (selected instanceof Date && !isNaN(selected.getTime())) {
      props.onChange(selected.toISOString());
    }
  };

  return (
    <DayPicker
      mode={"single"}
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium cursor-pointer hover:underline",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      month={month}
      onMonthChange={setMonth}
      locale={dayPickerLocale}
      selected={value ? new Date(value) : undefined}
      onSelect={handleDaySelect}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: () => {
          // Month names
          const [monthPopoverOpen, setMonthPopoverOpen] = React.useState(false);
          // Move month left/right
          const handlePrevMonth = () => {
            setMonth((prev) => {
              const m = prev.getMonth() - 1;
              return new Date(prev.getFullYear(), m, 1);
            });
          };
          const handleNextMonth = () => {
            setMonth((prev) => {
              const m = prev.getMonth() + 1;
              return new Date(prev.getFullYear(), m, 1);
            });
          };
          // RTL arrow order
          const leftArrow = (
            <button
              type="button"
              aria-label={isRtl ? "Next Month" : "Previous Month"}
              className="p-1 rounded hover:bg-accent"
              onClick={isRtl ? handleNextMonth : handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          );
          const rightArrow = (
            <button
              type="button"
              aria-label={isRtl ? "Previous Month" : "Next Month"}
              className="p-1 rounded hover:bg-accent"
              onClick={isRtl ? handlePrevMonth : handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          );
          return (
            <div className="flex justify-between items-center w-full px-2">
              {/* Month & Year vertical stack on left */}
              <div className="flex flex-col items-start space-y-1">
                {/* Year Popover */}
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="text-md font-medium cursor-pointer hover:underline px-2 py-0 rounded focus:outline-none focus:ring my-0"
                      onClick={() => setPopoverOpen((open) => !open)}
                    >
                    {isRtl ? toArabicNumeral(month.getFullYear()) : month.getFullYear()}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="max-h-60 overflow-y-auto min-w-[220px] p-0"
                  >
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {years.map((year) => (
                        <button
                          key={year}
                          type="button"
                          className={`rounded shadow text-center px-2 py-3 hover:bg-accent transition-colors ${
                            year === month.getFullYear()
                              ? "bg-accent font-bold"
                              : "bg-background"
                          }`}
                          onClick={() => handleYearChange(year)}
                        >
                          {isRtl ? toArabicNumeral(year) : year}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {/* Month Popover */}
                <Popover
                  open={monthPopoverOpen}
                  onOpenChange={setMonthPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="text-xl font-medium cursor-pointer hover:underline px-2 py-0 rounded focus:outline-none focus:ring my-0"
                      onClick={() => setMonthPopoverOpen((open) => !open)}
                    >
                      {monthNames[month.getMonth()]}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="max-h-60 overflow-y-auto min-w-[220px] p-0"
                  >
                    <div className="grid grid-cols-3 gap-2 p-2">
                      {monthNames.map((name, idx) => (
                        <button
                          key={name}
                          type="button"
                          className={`rounded shadow text-center px-2 py-3 hover:bg-accent transition-colors ${
                            idx === month.getMonth()
                              ? "bg-accent font-bold"
                              : "bg-background"
                          }`}
                          onClick={() => {
                            setMonth(new Date(month.getFullYear(), idx, 1));
                            setMonthPopoverOpen(false);
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              {/* Arrows on right, horizontal, RTL aware */}
              <div className="flex flex-row items-center space-x-1">
                {isRtl ? (
                  <>
                    {rightArrow}
                    {leftArrow}
                  </>
                ) : (
                  <>
                    {leftArrow}
                    {rightArrow}
                  </>
                )}
              </div>
            </div>
          );
        },
        DayContent: (props) => {
          const day = props.date;
          return <span>{isRtl ? toArabicNumeral(day.getDate()) : day.getDate()}</span>;
        },
      }}
      {...props as Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
