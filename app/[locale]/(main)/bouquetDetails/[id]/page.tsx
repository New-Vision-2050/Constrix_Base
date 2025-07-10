"use client";

import PermissionsBouquet from "@/modules/bouquet/components/permissions";
import React from "react";

interface BouquetDetailsProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

export default function BouquetDetailsPage({ params }: BouquetDetailsProps) {
  const resolvedParams = React.use(params);

  return (
    <>
      <PermissionsBouquet packageId={resolvedParams.id} />
    </>
  );
}
