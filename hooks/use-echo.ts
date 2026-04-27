import { useContext } from "react";
import { EchoContext, EchoContextValue } from "@/providers/echo-provider";

export function useEcho(): EchoContextValue {
  const ctx = useContext(EchoContext);
  if (!ctx) {
    throw new Error("useEcho must be used inside <EchoProvider>");
  }
  return ctx;
}
