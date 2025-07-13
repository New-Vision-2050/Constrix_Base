"use client";
import CanSeeContent from "@/components/shared/CanSeeContent";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { can } from "@/hooks/useCan";
import {
  PERMISSION_ACTIONS,
  PERMISSION_SUBJECTS,
} from "@/modules/roles-and-permissions/permissions";
import UsersSubEntityTable from "@/modules/users/components/users-sub-entity-table";
import React from "react";

const CompaniesSubProgram = () => {
  const canList = can(
    PERMISSION_ACTIONS.LIST,
    PERMISSION_SUBJECTS.USER
  ) as boolean;

  return (
    <CanSeeContent canSee={canList}>
      <UsersSubEntityTable programName={SUPER_ENTITY_SLUG.COMPANY} />
    </CanSeeContent>
  );
};

export default CompaniesSubProgram;
