"use client";

import PermissionsBouquet from "@/modules/bouquet/components/permissions";
import React from "react";

interface BouquetDetailsProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function BouquetDetailsPage({ params }: BouquetDetailsProps) {
  const { id } = params;

  return (
    <>
      <PermissionsBouquet packageId={id} />
    </>
  );
}
