"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

const RenderLocaleSwitch = () => {
  const pathname = usePathname();
  const locale = useLocale();

  const targetLocale = locale === "en" ? "ar" : "en";
  const targetLabel = locale === "en" ? "ع" : "EN";

  return (
    <Link
      href={`/${pathname}`}
      locale={targetLocale}
      className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
    >
      <Globe className="h-4 w-4 shrink-0" />
      <span>{targetLabel}</span>
    </Link>
  );
};

export default RenderLocaleSwitch;
