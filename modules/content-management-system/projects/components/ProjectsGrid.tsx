import ProjectCard from "./project-card";

type PropsT = {
    OnEditProject: (id: string) => void;
}
export default function ProjectsGrid({ OnEditProject }: PropsT) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
        <ProjectCard OnEdit={OnEditProject} />
    </div>
}
