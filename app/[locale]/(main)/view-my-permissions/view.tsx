"use client";

import JsonView from "@uiw/react-json-view";
import { nordTheme } from "@uiw/react-json-view/nord";

function View({ data }: { data: object }) {
  return (
    <div className="rounded-xl p-4">
      <JsonView value={data} style={nordTheme} />
    </div>
  );
}

export default View;
