import { useQuery } from "@tanstack/react-query";
import { AttendanceConstraints } from "@/services/api/attendance-constraints";

export const constraintBasicInfoQueryKey = (constraintId: string | undefined) =>
  ["constraint-basic-info", constraintId] as const;

export function useConstraintBasicInfo(constraintId: string | undefined) {
  return useQuery({
    queryKey: constraintBasicInfoQueryKey(constraintId),
    queryFn: async () => {
      const res = await AttendanceConstraints.patchBasicInfo(
        constraintId!,
        {},
      );
      return res.data.payload;
    },
    enabled: Boolean(constraintId),
    refetchOnWindowFocus: false,
  });
}
