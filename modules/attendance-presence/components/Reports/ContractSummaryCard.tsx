"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPORTS_COLORS } from "./reports-theme";

interface ContractMetricBlockProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
}

export default function ContractMetricBlock({
  icon: Icon,
  label,
  value,
  unit,
}: ContractMetricBlockProps) {
  return (
    <div
      className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-center"
      style={{ backgroundColor: REPORTS_COLORS.metricSurface }}
    >
      <Icon size={16} className="text-[#E91E63]" strokeWidth={1.75} />
      <span className="text-[10px] leading-snug text-muted-foreground">
        {label}
      </span>
      <span className="text-lg font-semibold leading-none text-foreground">
        {value}
      </span>
      <span className="text-[10px] text-muted-foreground">{unit}</span>
    </div>
  );
}

interface ContractSummaryCardProps {
  title: string;
  icon: LucideIcon;
  metrics: Array<{
    key: string;
    icon: LucideIcon;
    label: string;
    value: string;
    unit: string;
  }>;
  className?: string;
}

export function ContractSummaryCard({
  title,
  icon: TitleIcon,
  metrics,
  className,
}: ContractSummaryCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border p-4",
        className,
      )}
      style={{ backgroundColor: REPORTS_COLORS.cardSurface }}
    >
      <div className="flex items-center justify-center gap-2">
        <TitleIcon size={18} className="text-[#E91E63]" strokeWidth={1.75} />
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {metrics.map((metric) => (
          <ContractMetricBlock
            key={metric.key}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
          />
        ))}
      </div>
    </div>
  );
}
