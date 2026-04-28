"use client";

import { useParams } from "@/i18n/navigation";
import ClientRequestDetailsView from "./ClientRequestDetailsView";

export default function ClientRequestDetailsRoute() {
  const params = useParams();
  const id = params?.id as string | undefined;

  if (!id) {
    return null;
  }

  return <ClientRequestDetailsView requestId={id} />;
}
