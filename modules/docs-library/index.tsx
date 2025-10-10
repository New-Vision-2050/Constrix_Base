"use client";
import DocsLibraryEntryPoint from "./components/entry-point/entry-point";
import { DocsLibraryCxtProvider } from "./context/docs-library-cxt";

export default function DocsLibraryModule() {
  return (
    <DocsLibraryCxtProvider>
      <DocsLibraryEntryPoint />
    </DocsLibraryCxtProvider>
  );
}
