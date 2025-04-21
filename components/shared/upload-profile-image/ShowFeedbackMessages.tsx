import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";
import RegularList from "../RegularList";
import FeedbackTextInfo from "./FeedbackTextInfo";

type PropsT = { messages: ProfileImageMsg[] };
export default function ShowFeedbackMessages({ messages }: PropsT) {
  return (
    <div className="flex flex-col gap-4">
      <RegularList<ProfileImageMsg, "feedback">
        items={messages}
        sourceName="feedback"
        ItemComponent={FeedbackTextInfo}
        keyPrefix="user-image-validation"
      />
    </div>
  );
}
