"use client";

import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import FounderViewV2 from "./FounderViewV2";

function FounderView() {
  return (
    <Can check={[PERMISSIONS.CMS.founder.list]}>
      <FounderViewV2 />
    </Can>
  );
}

export default FounderView;
