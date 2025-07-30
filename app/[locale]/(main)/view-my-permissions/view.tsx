"use client";

import JsonView from "@uiw/react-json-view";

function View({ data }: { data: object }) {
  return <JsonView value={data} collapsed />;
}

export default View;
