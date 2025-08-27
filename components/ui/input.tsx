import { cn } from "@/lib/utils";
import PasswordIcon from "@/public/icons/password";
import { forwardRef, useMemo, useState } from "react";
import AutoHeight from "../animation/auto-height";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  inputClassName?: string;
  error?: string | null;
  variant?: "default" | "secondary";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      label,
      containerClassName,
      inputClassName,
      error,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };
    const inputType = type === "password" && showPassword ? "text" : type;

    const inputClassNames = useMemo(
      () => getInputClassNames(variant, inputClassName, error),
      [variant, inputClassName, error]
    );
    const labelClassNames = useMemo(
      () => getLabelClassNames(variant, error),
      [variant, error]
    );

    return (
      <div className={cn("group relative", containerClassName)}>
        <input
          type={inputType}
          id={label}
          placeholder=" "
          ref={ref}
          {...props}
          className={cn(inputClassNames, {
            "ltr:pr-8 ltr:pl-2 rtl:pl-8 rtl:pr-2":
              type === "password" && variant === "secondary",
            "ltr:pr-6 ltr:pl-0 rtl:pl-6 rtl:pr-0":
              type === "password" && variant === "default",
          })}
        />
        <label htmlFor={label} className={labelClassNames}>
          {label}
        </label>
        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className={cn(
              "absolute top-2.5",
              { "end-2": variant === "secondary" },
              { "end-0": variant === "default" },
              {
                "text-white/50 peer-focus:text-white/70": !error,
              },
              { "text-red-500": !!error }
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <PasswordIcon showPassword={showPassword} />
          </button>
        )}
        <AutoHeight
          condition={!!error}
          className="block w-full text-start text-sm text-red-500 leading-loose"
        >
          {error}
        </AutoHeight>
      </div>
    );
  }
);
Input.displayName = "Input";

export const getInputClassNames = (
  variant: "default" | "secondary",
  additionalClasses?: string,
  error?: string | null
) => {
  return cn(
    "block h-12 w-full text-sm bg-transparent appearance-none focus:outline-none peer",
    additionalClasses,
    {
      "px-0 border-b border-b-white/50 focus:ring-0": variant === "default",
      "focus:border-b-white/70 hover:border-b-white/70 transition duration-300":
        variant === "default" && !error,
      "border-red-500": variant === "default" && !!error,
      "px-2 rounded-md shadow-sm disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500":
        variant === "secondary",
      "border border-gray-300 hover:border-gray-500 transition duration-300 focus:border-transparent focus:ring-2 focus:ring-indigo-600":
        variant === "secondary" && !error,
      "border-transparent ring-2 ring-red-500 focus:ring-red-500":
        variant === "secondary" && !!error,
    }
  );
};

export const getLabelClassNames = (
  variant: "default" | "secondary",
  error?: string | null
) => {
  return cn("absolute duration-300 transform peer-focus:z-10 ", {
    "top-[-0.3rem] origin-left rtl:origin-right start-0 ":
      variant === "default",
    "-translate-y-6 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1 peer-placeholder-shown:opacity-50 peer-focus:opacity-100 peer-focus:scale-75 peer-focus:-translate-y-6":
      variant === "default" && !error,
    "text-red-500 -translate-y-6 scale-75": variant === "default" && !!error,
    "start-2 top-0 bg-white px-1 text-xs transition-all peer-disabled:bg-transparent":
      variant === "secondary",
    "-translate-y-2.5 z-10 peer-focus:z-10 peer-placeholder-shown:translate-y-2.5 peer-placeholder-shown:text-sm peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-indigo-600 ":
      variant === "secondary" && !error,
    "text-red-500 -translate-y-2.5 z-10": variant === "secondary" && !!error,
  });
};

export { Input };
