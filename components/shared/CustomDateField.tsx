import React, { memo, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/modules/table/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
import { Button } from "@/modules/table/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PropsT = {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function CustomDateField(props: PropsT) {
  // declare and define component state and variables
  const {
    name,
    disabled,
    placeholder,
    className,
    selectedDate,
    setSelectedDate,
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const error = null;
  const touched = false;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={name}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            !!error && touched ? "border-destructive" : "",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date ?? undefined);
            setIsOpen(false);
          }}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default memo(CustomDateField);
