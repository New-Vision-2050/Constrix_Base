"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { UserAttendanceApi } from "@/services/api/user-attendance";
import useFaceVerificationException, {
  exceptionToFaceVerificationEnabled,
  faceVerificationEnabledToException,
  faceVerificationExceptionQueryKey,
} from "../../hooks/useFaceVerificationException";

type Props = {
  userId?: string;
};

export default function FaceVerificationSwitch({ userId }: Props) {
  const tJobData = useTranslations("UserProfile.nestedTabs.jobData");
  const queryClient = useQueryClient();
  const { data, isLoading } = useFaceVerificationException(userId);

  const faceVerificationEnabled = exceptionToFaceVerificationEnabled(
    data?.has_face_verification_exception,
  );

  const [checked, setChecked] = useState(faceVerificationEnabled);

  useEffect(() => {
    setChecked(faceVerificationEnabled);
  }, [faceVerificationEnabled]);

  const mutation = useMutation({
    mutationFn: (enabled: boolean) => {
      if (!userId) {
        throw new Error("Missing user id");
      }

      return UserAttendanceApi.updateFaceVerificationException(userId, {
        has_exception: faceVerificationEnabledToException(enabled),
      });
    },
    onSuccess: (response) => {
      if (!userId) return;

      queryClient.setQueryData(
        faceVerificationExceptionQueryKey(userId),
        response.data.payload,
      );
      toast.success(tJobData("faceVerificationSaveSuccess"));
    },
    onError: (_error, _enabled, context) => {
      if (context?.previousValue !== undefined) {
        setChecked(context.previousValue);
      }
      toast.error(tJobData("faceVerificationSaveError"));
    },
  });

  const handleToggle = (nextValue: boolean) => {
    if (!userId || isLoading || mutation.isPending) return;

    const previous = checked;
    setChecked(nextValue);
    mutation.mutate(nextValue, {
      context: { previousValue: previous },
    });
  };

  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2.5">
      <span className="text-sm font-medium">{tJobData("faceVerification")}</span>
      <div className="flex items-center gap-2">
        {isLoading || mutation.isPending ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : null}
        <Switch
          checked={checked}
          disabled={!userId || isLoading || mutation.isPending}
          onCheckedChange={handleToggle}
          aria-label={tJobData("faceVerification")}
        />
      </div>
    </div>
  );
}
