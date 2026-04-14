"use client";

import {
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Users,
  XCircle,
} from "lucide-react";
import { useTheme } from "@mui/material";
import StatisticsCardHeader from "@/modules/organizational-structure/components/StatisticsCard/StatisticsCardHeader";
import type {
  InboxSegmentCounts,
  InboxStatusSegment,
} from "@/modules/projects/inbox/inbox-status-segment";

type InboxStatsWidgetsProps = {
  counts: InboxSegmentCounts;
  labels: {
    awaiting: string;
    rejected: string;
    accepted: string;
    inProgress: string;
    total: string;
  };
};

const segmentOrder: (
  | { kind: "segment"; key: InboxStatusSegment }
  | { kind: "total" }
)[] = [
  { kind: "segment", key: "awaiting" },
  { kind: "segment", key: "rejected" },
  { kind: "segment", key: "accepted" },
  { kind: "segment", key: "in_progress" },
  { kind: "total" },
];

export default function InboxStatsWidgets({
  counts,
  labels,
}: InboxStatsWidgetsProps) {
  const { palette } = useTheme();

  function segmentIcon(
    key: "awaiting" | "rejected" | "accepted" | "in_progress" | "total",
  ) {
    const size = 22;
    switch (key) {
      case "awaiting":
        return <AlertCircle size={size} color={palette.warning.main} strokeWidth={2} />;
      case "rejected":
        return <XCircle size={size} color={palette.error.main} strokeWidth={2} />;
      case "accepted":
        return <CheckCircle2 size={size} color={palette.success.main} strokeWidth={2} />;
      case "in_progress":
        return <ListTodo size={size} color={palette.warning.dark} strokeWidth={2} />;
      default:
        return <Users size={size} color={palette.info.main} strokeWidth={2} />;
    }
  }
  return (
    <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 mb-4">
      {segmentOrder.map((item) => {
        if (item.kind === "total") {
          return (
            <div key="total" className="rounded-lg px-1 py-0.5">
              <StatisticsCardHeader
                title={labels.total}
                number={counts.total.toLocaleString()}
                icon={segmentIcon("total")}
              />
            </div>
          );
        }

        const key = item.key;
        const value =
          key === "awaiting"
            ? counts.awaiting
            : key === "rejected"
              ? counts.rejected
              : key === "accepted"
                ? counts.accepted
                : counts.inProgress;
        const label =
          key === "awaiting"
            ? labels.awaiting
            : key === "rejected"
              ? labels.rejected
              : key === "accepted"
                ? labels.accepted
                : labels.inProgress;

        return (
          <div key={key} className="rounded-lg px-1 py-0.5">
            <StatisticsCardHeader
              title={label}
              number={value.toLocaleString()}
              icon={segmentIcon(key)}
            />
          </div>
        );
      })}
    </div>
  );
}
