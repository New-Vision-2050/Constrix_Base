import ProjectCard from "./project-card";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";
import { EditIcon } from "lucide-react";

type PropsT = {
    OnEditProject: (id: string) => void;
}
export default function ProjectsGrid({ OnEditProject }: PropsT) {
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
        <ProjectCard id="1" src="" title="Project 1" actions={actions} />
        <ProjectCard id="1" src="" title="Project 2" actions={actions} />
        <ProjectCard id="1" src="" title="Project 3" actions={actions} />
        <ProjectCard id="1" src="" title="Project 4" actions={actions} />
        <ProjectCard id="1" src="" title="Project 5" actions={actions} />
        <ProjectCard id="1" src="" title="Project 6" actions={actions} />
        <ProjectCard id="1" src="" title="Project 7" actions={actions} />
    </div>
}
