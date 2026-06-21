import {
  BarChart3,
  Briefcase,
  Calendar,
  CalendarCheck,
  Clock,
  Gauge,
  Send,
  User,
  type LucideIcon,
} from "lucide-react";
import { ContractMetricItem, ContractSummaryCardData } from "../types/reports";

type ContractCardConfig = {
  key: string;
  titleKey: string;
  icon: LucideIcon;
  metrics: Array<Omit<ContractMetricItem, "value">>;
};

export const CONTRACT_SUMMARY_CARDS_CONFIG: ContractCardConfig[] = [
  {
    key: "contract",
    titleKey: "employmentContract",
    icon: Briefcase,
    metrics: [
      {
        key: "attendance-days",
        labelKey: "contractAttendanceDays",
        unitKey: "dayUnit",
        icon: Calendar,
      },
      {
        key: "leaves",
        labelKey: "contractLeaves",
        unitKey: "dayUnit",
        icon: Send,
      },
      {
        key: "holidays",
        labelKey: "contractHolidays",
        unitKey: "dayUnit",
        icon: CalendarCheck,
      },
      {
        key: "required-hours",
        labelKey: "contractRequiredHours",
        unitKey: "hourUnit",
        icon: Clock,
      },
    ],
  },
  {
    key: "achieved",
    titleKey: "achievedFromContract",
    icon: Gauge,
    metrics: [
      {
        key: "attendance-days",
        labelKey: "achievedAttendanceDays",
        unitKey: "dayUnit",
        icon: User,
      },
      {
        key: "leaves",
        labelKey: "usedLeaves",
        unitKey: "dayUnit",
        icon: Send,
      },
      {
        key: "holidays",
        labelKey: "consumedHolidays",
        unitKey: "dayUnit",
        icon: Calendar,
      },
      {
        key: "hours",
        labelKey: "achievedHours",
        unitKey: "hourUnit",
        icon: Clock,
      },
    ],
  },
  {
    key: "remaining",
    titleKey: "remainingFromContract",
    icon: BarChart3,
    metrics: [
      {
        key: "attendance-days",
        labelKey: "remainingAttendanceDays",
        unitKey: "dayUnit",
        icon: User,
      },
      {
        key: "leaves",
        labelKey: "remainingLeaves",
        unitKey: "dayUnit",
        icon: Send,
      },
      {
        key: "holidays",
        labelKey: "remainingHolidays",
        unitKey: "dayUnit",
        icon: Calendar,
      },
      {
        key: "hours",
        labelKey: "remainingHours",
        unitKey: "hourUnit",
        icon: Clock,
      },
    ],
  },
];

export type { ContractCardConfig, ContractSummaryCardData };
