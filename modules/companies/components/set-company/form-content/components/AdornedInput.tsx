import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

type PropsT = {
  label: string;
  fieldName: string;

  errMsg?: string;
  sAdornment?: string;
  eAdornment?: string;
};

const inputStyle = `w-full rounded-lg border border-gray-300 px-4 py-2 text-white shadow-sm 
                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400
                   transition duration-200 ease-in-out bg-transparent`;

const AdornedInput = (props: PropsT) => {
  const { register } = useFormContext();
  const { label, fieldName, errMsg, sAdornment, eAdornment } = props;
  const align =
    Boolean(sAdornment) && Boolean(eAdornment)
      ? "center"
      : Boolean(sAdornment)
      ? "left"
      : "right";

  return (
    <>
      <div className="relative w-full">
        {/* Start Adornment (Text) */}
        {Boolean(sAdornment) && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {sAdornment}
          </span>
        )}

        {/* Input Field */}
        <Input
          variant="default"
          type="text"
          label={label}
          className={`${inputStyle} text-${align}`}
          {...register(fieldName)}
        />

        {/* End Adornment (Text) */}
        {Boolean(eAdornment) && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {eAdornment}
          </span>
        )}
      </div>
      {Boolean(errMsg) && <p className=" text-red-600">{errMsg}</p>}
    </>
  );
};

export default AdornedInput;
