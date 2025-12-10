'use client';
import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { useTranslations } from "next-intl";
import ProjectsTabContent from "./ProjectsTabContent";
import ProjectTypesTable from "./Project-types/ProjectTypesTable";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function ProjectsTabs() {
    const { can } = usePermissions();
    const t = useTranslations("content-management-system.projects.tabs");
    const projectsTabs = [
        {
            id: "projects",
            title: t("projects"),
            content: <ProjectsTabContent />,
            show: can(PERMISSIONS.CMS.projects.list),
        },
        {
            id: "projects-types",
            title: t("projectsTypes"),
            content: <ProjectTypesTable />,
            show: can(PERMISSIONS.CMS.projectsTypes.list),
        },
    ];

    return (
        <HorizontalTabs
            list={projectsTabs?.filter((tab) => tab.show)}
            additionalClassiess="justify-start"
        />
    );
}
