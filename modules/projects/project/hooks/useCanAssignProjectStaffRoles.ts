import { useMemo } from "react";
import {
  useOptionalProject,
} from "@/modules/all-project/context/ProjectContext";
import useUserProfileData from "@/modules/user-profile/hooks/useUserProfileData";

/**
 * Only the project's `manager_id` may change staff/cadre project roles (`user_id` from company-users profile).
 */
export function useCanAssignProjectStaffRoles(canUpdate: boolean) {
  const project = useOptionalProject();
  const projectData = project?.projectData;
  const isLoadingProject = project?.isLoading ?? false;
  const { data: profileData, isLoading: isLoadingProfile } =
    useUserProfileData();

  return useMemo(() => {
    if (!canUpdate || isLoadingProject || isLoadingProfile) return false;
    const managerId = projectData?.manager_id;
    const userId = profileData?.user_id;
    if (!managerId || !userId) return false;
    return String(managerId) === String(userId);
  }, [
    canUpdate,
    isLoadingProject,
    isLoadingProfile,
    projectData?.manager_id,
    profileData?.user_id,
  ]);
}
