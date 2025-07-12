"use client";

import { can } from "@/hooks/useCan";
import CanSeeContent from "@/components/shared/CanSeeContent";
import UsersContent from "@/modules/users/components/UsersContent";
import { Actions } from "@/lib/ability";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/constants/permissions";

const UsersPage = () => {
  const canList = can(PERMISSION_ACTIONS.LIST, PERMISSION_SUBJECTS.USER) as boolean;

  return (
    <CanSeeContent canSee={canList}>
      <UsersContent />
    </CanSeeContent>
  );
};

export default UsersPage;
