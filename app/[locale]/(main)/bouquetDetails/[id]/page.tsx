"use client";

import PermissionsBouquet from "@/modules/bouquet/components/permissions";
import { useParams } from "next/navigation";

export default function BouquetDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <>
      <PermissionsBouquet packageId={id} />

    </>
  );
}
