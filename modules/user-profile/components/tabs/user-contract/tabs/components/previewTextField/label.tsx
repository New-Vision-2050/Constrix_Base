import { Asterisk } from "lucide-react";

type PropsT = {
  label?: string;
  required?: boolean;
  labelDir: string;
};

export default function PreviewTextFieldLabel(props: PropsT) {
  // destructure props
  const { labelDir, label, required } = props;

  // if no label is provided, render nothing
  if (!label) return <></>;

  return (
    <span
      className={`absolute top-[-14px] text-[12px] ${labelDir} flex items-center text-gray-600`}
    >
      <span>{label}</span>

      {/* asterisk if the field is required */}
      {required === true && <Asterisk size={"12px"} color="red" />}
    </span>
  );
}
