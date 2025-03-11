import { Asterisk } from "lucide-react";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

type PropsT = {
  label: string;
  fieldName: string;
  errMsg?: string;
  required?: boolean;
  placeholder?: string;
  startAdornment?: React.ReactNode; // Start icon
  endAdornment?: React.ReactNode; // End icon
};

export default function InputFieldWithAdorned(props: PropsT) {
  const {
    label,
    fieldName,
    errMsg,
    required,
    placeholder,
    startAdornment,
    endAdornment,
  } = props;
  const { register } = useFormContext();
  const borderColor = useMemo(() => {
    return Boolean(errMsg) ? "red-500" : "[#E7E3FC61]";
  }, [errMsg]);

  return (
    <div className="w-full px-2 my-2">
      {/* Label with Required Asterisk */}
      <label
        htmlFor={fieldName}
        className="flex items-center gap-1 text-lg font-medium text-[#E7E3FC61]"
      >
        {label}
        {required && <Asterisk className="text-red-500 w-[12px]" />}
      </label>

      {/* Input Container with Start & End Adornments */}
      <div className="relative flex items-center mt-1">
        {/* Start Adornment (Left) */}
        {startAdornment && (
          <div className="absolute left-3 text-gray-400">{startAdornment}</div>
        )}

        <input
          type="text"
          id={fieldName}
          placeholder={placeholder || "Enter text..."}
          className={`
            h-[56px] w-full rounded-md border bg-transparent p-2 
            ${startAdornment ? "pl-[6.25rem]" : "pl-3"} ${
            endAdornment ? "pr-[6.25rem]" : "pr-3"
            }
            shadow-sm 
            border-${borderColor} 
            focus:border-${borderColor}-500 
            focus:ring-${borderColor}-500
          `}
          {...register(fieldName)}
        />

        {/* End Adornment (Right) */}
        {endAdornment && (
          <div className="absolute right-3 text-gray-400">{endAdornment}</div>
        )}
      </div>

      {/* Error Message */}
      {Boolean(errMsg) && <p className="text-sm text-red-500">{errMsg}</p>}
    </div>
  );
}
