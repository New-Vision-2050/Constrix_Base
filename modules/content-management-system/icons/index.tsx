"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import IconsGrid from "./components/IconsGrid";

export default function CMSIconsModule() {
    const t = useTranslations("content-management-system.icons");

    return <div className="px-6 py-2 flex flex-col gap-4">
        {/* title & add action */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <Button>
                <PlusIcon />
                {t("addIcon")}
            </Button>
        </div>
        {/* icons grid */}
        <IconsGrid OnEdit={()=>{}} />
    </div>
}