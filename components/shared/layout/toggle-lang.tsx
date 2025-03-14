"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LangIcon from "@/public/icons/lang";
import { useRouter, usePathname } from 'next/navigation';
import { SA, US } from 'country-flag-icons/react/3x2'
import { useLocale } from 'next-intl';
import {navigate} from "next/dist/client/components/segment-cache/navigation";

const ToggleLang = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Get the base path (e.g., /companies)
    const basePath = pathname.replace(/^\/(en|ar)/, ``);

    // Construct the new path with the new locale
    const newPathname = `/${newLocale}${basePath}`;
      window.location = newPathname;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <LangIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLocaleChange('en')}>
          <US style={{ width: '20px', marginRight: '5px' }} title="United States" />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange('ar')}>
          <SA style={{ width: '20px', marginRight: '5px' }} title="Saudi Arabia" />
          Arabic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleLang;
