import PinIcon from "@/public/icons/pin";
import { Asterisk } from "lucide-react";

type PropsT = {
  label?: string;
  required?: boolean;
  labelDir: string;
  needRequest?: boolean;
};

export default function PreviewTextFieldLabel(props: PropsT) {
  // destructure props
  const { labelDir, label, required,needRequest } = props;

  // if no label is provided, render nothing
  if (!label) return <></>;

  return (
    <span
      className={`absolute top-[-30px]  text-[12px] ${labelDir} flex items-center text-gray-600`}
    >
      {needRequest && <PinIcon className="me-1" />}

      <span>{label}</span>

      {/* asterisk if the field is required */}
      {required === true && <Asterisk size={"12px"} color="red" />}
    </span>
  );
}
