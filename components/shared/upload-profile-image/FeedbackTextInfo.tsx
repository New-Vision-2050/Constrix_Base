import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";
import InfoIcon from "@/public/icons/InfoIcon";
import { CircleCheckIcon } from "lucide-react";

type PropsT = {
  feedback: ProfileImageMsg;
};

export default function FeedbackTextInfo({ feedback }: PropsT) {
  return (
    <div className="flex gap-2">
      <div className="w-[24px] h-[24px] flex items-center justify-center">
        {feedback?.status === 1 ? (
          <CircleCheckIcon color="green" />
        ) : (
          <InfoIcon additionClass="text-orange-400" />
        )}
      </div>
      <p className="text-md">{feedback.sentence}</p>
    </div>
  );
}
