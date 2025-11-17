import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ProjectsGrid from "./ProjectsGrid";

export default function ProjectsTabContent() {
    const t = useTranslations("content-management-system.projects");

    return <div className="flex flex-col gap-4">
        {/*  add project button & title */}
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <Button>
                <PlusIcon />
                {t("addProject")}
            </Button>
        </div>
        {/* projects grid */}
        <ProjectsGrid />
    </div>
}