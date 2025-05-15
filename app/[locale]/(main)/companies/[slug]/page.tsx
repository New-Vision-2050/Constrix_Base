import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import CompaniesSubEntityTable from "@/modules/companies/components/CompaniesSubEntityTable";
import UsersSubEntityTable from "@/modules/users/components/users-sub-entity-table";
import React from "react";

const CompaniesSubProgram = () => {
  return <UsersSubEntityTable programName={SUPER_ENTITY_SLUG.COMPANY} />;
};

export default CompaniesSubProgram;
