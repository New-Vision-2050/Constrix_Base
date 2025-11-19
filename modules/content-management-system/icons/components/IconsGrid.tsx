import { CompanyDashboardIconsApi } from "@/services/api/company-dashboard/icons";
import ProjectCard from "../../projects/components/project-card";

type PropsT = {
    OnEdit: (id: string) => void;
}
export default async function IconsGrid({ OnEdit }: PropsT) {
    const { data: iconsData } = await CompanyDashboardIconsApi.list();
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard OnEdit={OnEdit} />
        <ProjectCard OnEdit={OnEdit} />
        <ProjectCard OnEdit={OnEdit} />
        <ProjectCard OnEdit={OnEdit} />
        <ProjectCard OnEdit={OnEdit} />
        <ProjectCard OnEdit={OnEdit} />
        <ProjectCard OnEdit={OnEdit} />
        <ProjectCard OnEdit={OnEdit} />
    </div>
}