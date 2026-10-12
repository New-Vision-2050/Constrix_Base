"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

type Props = {
  year: number;
  onChange: (year: number) => void;
  /** How many past years to offer (default 3). */
  pastYears?: number;
  /** How many future years to offer (default 1). */
  futureYears?: number;
  className?: string;
};

/**
 * Year selector for leave balances — balances are computed live per year,
 * so switching the year simply re-calls the endpoint with `?year=`.
 */
export default function LeaveYearSelect({
  year,
  onChange,
  pastYears = 3,
  futureYears = 1,
  className,
}: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    const list: number[] = [];
    for (let y = current + futureYears; y >= current - pastYears; y--) {
      list.push(y);
    }
    return list;
  }, [pastYears, futureYears]);

  return (
    <Select
      value={String(year)}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger className={className ?? "w-[130px]"}>
        <SelectValue placeholder={t("year")} />
      </SelectTrigger>
      <SelectContent>
        {years.map((y) => (
          <SelectItem key={y} value={String(y)}>
            {y}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
