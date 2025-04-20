import { useQuery } from "@tanstack/react-query";
import GetUserExperienceData from "../api/get-user-experiences";

export default function useUserExperiences(userId: string) {
  return useQuery({
    queryKey: [`user-experiences-data`, userId],
    queryFn: () => GetUserExperienceData(userId),
  });
}
