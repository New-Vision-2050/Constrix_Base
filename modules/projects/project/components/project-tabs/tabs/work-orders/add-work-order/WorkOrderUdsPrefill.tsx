"use client";

import { useEffect, useMemo, useRef } from "react";
import { useProjectManagements } from "@/modules/projects/project/query/useProjectManagements";
import { useUdsWorkOrders } from "@/modules/projects/project/query/useUdsWorkOrders";
import {
  mapUdsWorkOrderToEntry,
  type UdsWorkOrderEntryPatch,
  type UdsWorkOrderLookups,
} from "./mapUdsWorkOrderToEntry";

export default function WorkOrderUdsPrefill({
  projectId,
  name,
  orderPermitId,
  lookups,
  onApply,
}: {
  projectId: string | undefined;
  name: string;
  orderPermitId: string;
  lookups: Omit<UdsWorkOrderLookups, "managements">;
  onApply: (patch: UdsWorkOrderEntryPatch) => void;
}) {
  const trimmedName = name.trim();
  const permitId = orderPermitId.trim();
  const appliedKeyRef = useRef("");

  const udsQuery = useUdsWorkOrders(projectId, trimmedName, permitId);
  const managementsQuery = useProjectManagements(projectId);

  const fullLookups = useMemo<UdsWorkOrderLookups>(
    () => ({
      ...lookups,
      managements: managementsQuery.data ?? [],
    }),
    [lookups, managementsQuery.data],
  );

  useEffect(() => {
    if (!trimmedName || !permitId) {
      appliedKeyRef.current = "";
    }
  }, [permitId, trimmedName]);

  useEffect(() => {
    const dto = udsQuery.data;
    if (!dto || !trimmedName || !permitId) return;

    const key = `${trimmedName}:${permitId}`;
    if (appliedKeyRef.current === key) return;

    appliedKeyRef.current = key;
    onApply({
      ...mapUdsWorkOrderToEntry(dto, fullLookups),
      workOrderId: trimmedName,
      workOrderType: permitId,
    });
  }, [fullLookups, onApply, permitId, trimmedName, udsQuery.data]);

  return null;
}
