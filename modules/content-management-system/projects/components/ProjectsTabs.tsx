'use client';
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import ProjectsTabContent from "./ProjectsTabContent";

export default function ProjectsTabs() {
    const t = useTranslations("content-management-system.projects.tabs");
    const projectsTabs = [
        {
            id: "projects",
            title: t("projects"),
            content: <ProjectsTabContent />,
        },
        {
            id: "projects-types",
            title: t("projectsTypes"),
            content: <>projectsTypes</>,
        },
    ];

    return (
        <HorizontalTabs
            list={projectsTabs}
            additionalClassiess="justify-start"
        />
    );
}