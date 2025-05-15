import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import UsersSubEntityTable from "@/modules/users/components/users-sub-entity-table";
import React from "react";

const SettingsSubProgram = () => {
  return <UsersSubEntityTable programName={SUPER_ENTITY_SLUG.SETTINGS} />;
};

export default SettingsSubProgram;
