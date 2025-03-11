// form hook
import {
  Controller,
  FieldValues,
  Path,
  Control,
  ControllerRenderProps,
} from "react-hook-form";

// shad-cn-ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// types
import { Option } from "@/types/Option";
import { useMemo } from "react";
import { Asterisk } from "lucide-react";

type CustomSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  error?: boolean;
  required?: boolean;
  errorMessage?: string;
};

// Main CustomSelect component
const CustomSelect = <T extends FieldValues>({
  name,
  control,
  options,
  required,
  placeholder = "Select an option",
  error = false,
  errorMessage,
}: CustomSelectProps<T>) => {
  // Return the Controller component for handling form control
  return (
    <div className="w-full px-2 my-2">
      {/* Label with Required Asterisk */}
      <label
        htmlFor={name}
        className="flex items-center gap-1 text-lg font-medium text-[#E7E3FC61]"
      >
        {placeholder}
        {required && <Asterisk className="text-red-500 w-[12px]" />}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SelectField
            field={field}
            options={options}
            error={error}
            placeholder={placeholder}
          />
        )}
      />
      {error && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};

// Separate SelectField component for rendering the dropdown UI
const SelectField = <T extends FieldValues>({
  field,
  options,
  placeholder,
  error = false,
}: {
  error?: boolean;
  field: ControllerRenderProps<T, Path<T>>;
  options: Option[];
  placeholder: string;
}) => {
  const borderColor = useMemo(() => (Boolean(error) ? "red" : "gray"), [error]);
  return (
    <Select value={field.value} onValueChange={field.onChange}>
      <SelectTrigger
        className={`w-full  h-[56px] max-w-sm border-2 border-${borderColor}-300 dark:border-${borderColor}-700 px-4 py-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white rtl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="px-4 py-2 hover:bg-blue-500 hover:text-white rounded-md transition-all duration-150 cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
