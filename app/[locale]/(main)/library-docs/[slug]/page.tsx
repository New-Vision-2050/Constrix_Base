import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import UsersSubEntityTable from "@/modules/users/components/users-sub-entity-table";
import React from "react";

const DocsLibrarySubProgram = () => {
  return <UsersSubEntityTable programName={SUPER_ENTITY_SLUG.DOCS_LIBRARY} />;
};

export default DocsLibrarySubProgram;
