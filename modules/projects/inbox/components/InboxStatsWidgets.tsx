"use client";

import {
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Users,
  XCircle,
} from "lucide-react";
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

function segmentIcon(
  key: "awaiting" | "rejected" | "accepted" | "in_progress" | "total",
) {
  const size = 22;
  switch (key) {
    case "awaiting":
      return <AlertCircle size={size} color="#facc15" strokeWidth={2} />;
    case "rejected":
      return <XCircle size={size} color="#f87171" strokeWidth={2} />;
    case "accepted":
      return <CheckCircle2 size={size} color="#4ade80" strokeWidth={2} />;
    case "in_progress":
      return <ListTodo size={size} color="#d97706" strokeWidth={2} />;
    default:
      return <Users size={size} color="#7dd3fc" strokeWidth={2} />;
  }
}

export default function InboxStatsWidgets({
  counts,
  labels,
}: InboxStatsWidgetsProps) {
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
