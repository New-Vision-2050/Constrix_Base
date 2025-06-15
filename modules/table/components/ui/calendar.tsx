import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { parse, format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/modules/table/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  value,
  onChange,
  ...props
}: CalendarProps & { value: string; onChange: (date: string) => void }) {
  const parsedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : new Date();
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
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: () => {
          const date = parse(value, "yyyy-MM-dd", "string");
          const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newDate = parse(e.target.value, "yyyy-MM-dd", "string");
            const newYear = newDate.getFullYear();
            date.setFullYear(newYear);
            onChange(format(date, "yyyy-MM-dd"));
          };

          const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newDate = parse(e.target.value, "yyyy-MM-dd", "string");
            const newMonth = newDate.getMonth();
            date.setFullYear(newMonth);
            onChange(format(date, "yyyy-MM-dd"));
          };

          return (
            <div className="flex justify-center items-center space-x-2">
              <input
                type="number"
                value={date.getFullYear()}
                onChange={handleYearChange}
                className="w-16 text-center border rounded"
                placeholder="Year"
              />
              <select
                value={date.getMonth()} 
                onChange={handleMonthChange}
                className="border rounded"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                  </option>
                ))}
              </select>
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
