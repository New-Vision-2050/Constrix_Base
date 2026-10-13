"use client";

import { useLocale, useTranslations } from "next-intl";

type BalanceItem = {
  label: string;
  value: number | null;
};

type Props = {
  items: BalanceItem[];
  loading?: boolean;
};

export default function BalanceCards({ items, loading = false }: Props) {
  const locale = useLocale();
  const t = useTranslations("UserProfile.tabs.contractTabs.contractSettings");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-h-[120px] flex-col justify-between rounded-lg bg-sidebar p-4 shadow-md"
        >
          <p className="text-sm text-gray-400">{item.label}</p>
          <p className="text-3xl font-semibold">
            {loading ? (
              <span className="inline-block h-8 w-16 animate-pulse rounded bg-white/10" />
            ) : item.value === null ? (
              t("emptyValue")
            ) : (
              item.value.toLocaleString(locale)
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
