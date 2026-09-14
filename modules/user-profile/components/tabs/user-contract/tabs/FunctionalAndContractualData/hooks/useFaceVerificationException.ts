import { useQuery } from "@tanstack/react-query";
import { UserAttendanceApi } from "@/services/api/user-attendance";

export const faceVerificationExceptionQueryKey = (userId: string) =>
  ["face-verification-exception", userId] as const;

export function exceptionToFaceVerificationEnabled(
  hasException: boolean | undefined,
) {
  return !Boolean(hasException);
}

export function faceVerificationEnabledToException(enabled: boolean) {
  return !enabled;
}

export default function useFaceVerificationException(userId?: string) {
  return useQuery({
    queryKey: faceVerificationExceptionQueryKey(userId ?? ""),
    queryFn: async () => {
      const res = await UserAttendanceApi.getFaceVerificationException(userId!);
      return res.data.payload;
    },
    enabled: Boolean(userId),
  });
}
