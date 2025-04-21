import InfoIcon from "@/public/icons/InfoIcon";
import { CircleCheckIcon } from "lucide-react";

type PropsT = {
  valid: boolean;
  spanDir: string;
};

export default function PreviewTextFieldValidationIcon({
  valid,
  spanDir,
}: PropsT) {
  return (
    <span className={`absolute top-[8px] ${spanDir}`}>
      {valid ? (
        <CircleCheckIcon color="green" />
      ) : (
        <InfoIcon additionClass="text-orange-500" />
      )}
    </span>
  );
}
