"use client";

import PreviewTextField from "../../../components/previewTextField";
import { useTranslations } from "next-intl";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import useFaceVerificationException, {
  exceptionToFaceVerificationEnabled,
} from "../../hooks/useFaceVerificationException";

export default function FaceVerificationPreview() {
  const tJobData = useTranslations("UserProfile.nestedTabs.jobData");
  const { userId } = useUserProfileCxt();
  const { data, isLoading } = useFaceVerificationException(userId ?? undefined);

  const enabled = exceptionToFaceVerificationEnabled(
    data?.has_face_verification_exception,
  );

  return (
    <PreviewTextField
      label={tJobData("faceVerification")}
      value={
        isLoading
          ? "..."
          : enabled
            ? tJobData("enabled")
            : tJobData("disabled")
      }
      valid={!isLoading && enabled}
    />
  );
}
