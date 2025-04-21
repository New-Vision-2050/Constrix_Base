import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";
import InfoIcon from "@/public/icons/InfoIcon";
import { CircleCheckIcon } from "lucide-react";

type PropsT = {
  feedback: ProfileImageMsg;
};

export default function FeedbackTextInfo({ feedback }: PropsT) {
  return (
    <div className="flex gap-1">
      {feedback?.status === 1 ? (
        <CircleCheckIcon color="green" />
      ) : (
        <InfoIcon additionClass="text-orange-400" />
      )}
      <p className="text-md">{feedback.sentence}</p>
    </div>
  );
}
