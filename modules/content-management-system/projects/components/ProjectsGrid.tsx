import ProjectCard from "./project-card";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";
import { EditIcon } from "lucide-react";
import { CMSProject } from "../types";
import { StateError } from "@/components/shared/states";
import { useTranslations } from "next-intl";

type PropsT = {
    OnEditProject: (id: string) => void;
    projects: CMSProject[];
}
export default function ProjectsGrid({ OnEditProject, projects }: PropsT) {
    const t = useTranslations("content-management-system.projects");

    const actions: MenuItem[] = [
        {
            label: "Edit",
            icon: <EditIcon className="w-4 h-4" />,
            disabled: true,
            action: (row) => {
                OnEditProject(row.id);
            },
        },
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
            actions={actions} />
        ))}
    </div>
}
