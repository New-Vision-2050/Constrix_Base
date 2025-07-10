"use client";

import { can } from "@/hooks/useCan";
import CanSeeContent from "@/components/shared/CanSeeContent";
import UsersContent from "@/modules/users/components/UsersContent";
import { Actions } from "@/lib/ability";

const UsersPage = () => {
  const permission = can(["list"], "users.user") as Record<Actions, boolean>;
  
  return (
    <CanSeeContent canSee={permission.list}>
      <UsersContent />
    </CanSeeContent>
  );
};

export default UsersPage;
