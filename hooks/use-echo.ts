import { useContext } from "react";
import { EchoContext, EchoContextValue } from "@/providers/echo-provider";

export function useEcho(): EchoContextValue {
  const ctx = useContext(EchoContext);

  return ctx as EchoContextValue;
}
