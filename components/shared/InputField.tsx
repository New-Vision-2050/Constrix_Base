import { useMemo } from "react";
import { Asterisk, CircleAlert } from "lucide-react";

import { useFormContext } from "react-hook-form";

type PropsT = {
  label: string;
  fieldName: string;
  errMsg?: string;
  required?: boolean;
  placeholder?: string;
};

export default function InputField(props: PropsT) {
  const { label, fieldName, errMsg, required, placeholder } = props;
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

      {/* Input Container */}
      <div className="relative flex items-center mt-1">
        {Boolean(errMsg) && (
          <div className="absolute left-3 text-red-400" title={errMsg}>
            <CircleAlert />
          </div>
        )}

        <input
          type="text"
          id={fieldName}
          placeholder={placeholder || "Enter text..."}
          className={`
            h-[56px] w-full rounded-md border bg-transparent p-2 
            shadow-sm border-${borderColor}
            focus:border-${borderColor}-500 
            focus:ring-${borderColor}-500
          `}
          {...register(fieldName)}
        />
      </div>

      {/* Error Message */}
      {Boolean(errMsg) && <p className="text-sm text-red-500 my-1">{errMsg}</p>}
    </div>
  );
}
