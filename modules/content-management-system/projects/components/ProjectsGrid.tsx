import ProjectCard from "./project-card";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";
import { EditIcon, TrashIcon } from "lucide-react";
import { CMSProject } from "../types";
import { StateError } from "@/components/shared/states";
import { useTranslations } from "next-intl";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type ShowableMenuItem = MenuItem & { show: boolean };
type PropsT = {
    OnEditProject: (id: string) => void;
    OnDeleteProject: (id: string) => void;
    projects: CMSProject[];
}
export default function ProjectsGrid({ OnEditProject, OnDeleteProject, projects }: PropsT) {
    const { can } = usePermissions();
    const t = useTranslations("content-management-system.projects");

    const actions: ShowableMenuItem[] = [
        {
            label: "Edit",
            icon: <EditIcon className="w-4 h-4" />,
            disabled: true,
            action: (row) => {
                OnEditProject(row.id);
            },
            show: can(PERMISSIONS.CMS.projects.update),
        },
        {
            label: "Delete",
            icon: <TrashIcon className="w-4 h-4" />,
            disabled: true,
            action: (row) => {
                OnDeleteProject(row.id);
            },
            show: can(PERMISSIONS.CMS.projects.delete),
        }
    ];

     // handle no projects
     if (projects.length === 0) {
        return <StateError message={t("noProjects")} />;
    }

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
            <ProjectCard 
            key={project.id} 
            id={project.id} 
            src={project.main_image || ""} 
            description={project.description || ""}
            title={project.name || ""} 
            actions={actions?.filter((action) => action.show)} />
        ))}
    </div>
}
