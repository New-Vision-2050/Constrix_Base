"use client";

import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Input } from "@/modules/table/components/ui/input";
import JsonView from "@uiw/react-json-view";
import { nordTheme } from "@uiw/react-json-view/nord";
import { useState } from "react";

function View({ data }: { data: object }) {
  const [permission, setPermission] = useState("");

  console.log("PERMISSION_NAMES", PERMISSIONS);
  return (
    <div className="rounded-xl p-4">
      <Input
        title="Type Permission Key"
        placeholder="Type Permission Key"
        value={permission}
        onChange={(e) => setPermission(e.target.value)}
        className="mt-4 mb-2"
      />
      <div className="text-sm text-muted-foreground mb-2">
        <Can
          strict
          check={[permission]}
          fallback={
            <span className="text-red-500 text-lg font-bold">
              Permission denied
            </span>
          }
        >
          <span className="text-green-500 text-lg font-bold">
            ---Permission granted---
          </span>
        </Can>
      </div>
      <JsonView value={data} style={nordTheme} />
    </div>
  );
}

export default View;
