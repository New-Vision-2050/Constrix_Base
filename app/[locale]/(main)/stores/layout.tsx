import { PropsWithChildren } from "react";

function StoresLayout({ children }: PropsWithChildren) {
  return <div className="px-8">{children}</div>;
}

export default StoresLayout;
