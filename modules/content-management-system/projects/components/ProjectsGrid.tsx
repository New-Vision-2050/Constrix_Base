import ProjectCard from "./project-card";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";
import { EditIcon } from "lucide-react";
import { CMSProject } from "../types";

type PropsT = {
    OnEditProject: (id: string) => void;
    projects: CMSProject[];
}
export default function ProjectsGrid({ OnEditProject, projects }: PropsT) {
    const actions: MenuItem[] = [
        {
            label: "Edit",
            icon: <EditIcon className="w-4 h-4" />,
            disabled: false,
            action: (row) => {
                OnEditProject(row.id);
            },
        },
    ];

    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
            <ProjectCard 
            key={project.id} 
            id={project.id} 
            src={project.main_image || ""} 
            title={project.name || ""} 
            actions={actions} />
        ))}
    </div>
}
