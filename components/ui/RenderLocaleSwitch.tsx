"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";

const RenderLocaleSwitch = () => {
  const pathname = usePathname();
  const locale = useLocale();
  console.log(locale);

  return (
    <div>
      {locale == "en" ? (
        <Link href={`/${pathname}`} locale="ar" className="text-lg p-2">
          <div className="flex justify-between items-center gap-2 text-white">
            English
          </div>
        </Link>
      ) : (
        <Link href={`/${pathname}`} locale="en" className="text-lg p-2">
          <div className="flex justify-between items-center gap-2 text-white">
            Arabic
          </div>
        </Link>
      )}
    </div>
  );
};

export default RenderLocaleSwitch;
