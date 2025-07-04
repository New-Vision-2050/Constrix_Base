import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

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
  // Generate a range of years (start from 1950 to current year + 20)
  const startYear = 1900;
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

console.log("value", value);
  return (
    <DayPicker
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
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: () => {
          // Month names
          const monthNames = [
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
          ];
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
                      {month.getFullYear()}
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
                          {year}
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
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
