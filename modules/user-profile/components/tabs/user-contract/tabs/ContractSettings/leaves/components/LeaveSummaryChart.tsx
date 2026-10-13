"use client";

import { useTranslations } from "next-intl";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const TRANSLATION_NAMESPACE =
  "UserProfile.tabs.contractTabs.contractSettings";

const CONSUMED_COLOR = "#14b8a6"; // teal
const REMAINING_COLOR = "#ec4899"; // pink
const EMPTY_COLOR = "#4b5563"; // gray-600

type Props = {
  /** Approved (used) days for the selected year. */
  used: number;
  /** Total entitled days for the selected year. */
  entitled: number;
  loading?: boolean;
};

/**
 * Donut chart card: consumed leaves vs remaining leaves as a percentage of
 * the yearly entitlement.
 */
export default function LeaveSummaryChart({
  used,
  entitled,
  loading = false,
}: Props) {
  const t = useTranslations(TRANSLATION_NAMESPACE);

  const hasData = entitled > 0;
  const remaining = Math.max(entitled - used, 0);
  const consumedPct = hasData ? Math.round((used / entitled) * 100) : 0;
  const remainingPct = hasData ? 100 - consumedPct : 0;

  const data = hasData
    ? [
        { name: t("leavesConsumed"), value: used, color: CONSUMED_COLOR },
        { name: t("leavesRemaining"), value: remaining, color: REMAINING_COLOR },
      ]
    : [{ name: t("leavesRemaining"), value: 1, color: EMPTY_COLOR }];

  if (loading) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-gray-700 p-4">
        <div className="h-32 w-32 animate-pulse rounded-full bg-white/5" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-700 p-4">
      {/* percentage labels */}
      <div className="flex items-center justify-between text-sm">
        <span>
          {t("leavesConsumed")}{" "}
          <span className="font-semibold" style={{ color: CONSUMED_COLOR }}>
            {consumedPct}%
          </span>
        </span>
        <span>
          {t("leavesRemaining")}{" "}
          <span className="font-semibold" style={{ color: REMAINING_COLOR }}>
            {remainingPct}%
          </span>
        </span>
      </div>

      {/* donut */}
      <div className="h-[180px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="88%"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
              isAnimationActive={false}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color} />
              ))}
            </Pie>
            {hasData && (
              <Tooltip
                formatter={(value, name) => [
                  `${Number(value).toLocaleString()} ${t("dayUnit")}`,
                  name,
                ]}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
        <span className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: CONSUMED_COLOR }}
          />
          {t("leavesConsumed")}
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: REMAINING_COLOR }}
          />
          {t("leavesRemaining")}
        </span>
      </div>
    </div>
  );
}
