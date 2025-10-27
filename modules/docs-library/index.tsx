"use client";
import DocsLibraryEntryPoint from "./components/entry-point/entry-point";
import { DocsLibraryCxtProvider } from "./context/docs-library-cxt";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function DocsLibraryModule() {
  return (
    <DocsLibraryCxtProvider>
      <Can check={[PERMISSIONS.library.folder.list]}>
        <DocsLibraryEntryPoint />
      </Can>
    </DocsLibraryCxtProvider>
  );
}
