"use client";

import Programs from "@/modules/programs/views";
import React from "react";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { withPermissionsPage } from "@/lib/permissions/client/withPermissionsPage";

function ProgramsPage() {
  return <Programs />;
}

export default withPermissionsPage(ProgramsPage, [
  Object.values(PERMISSIONS.companyAccessProgram),
]);
