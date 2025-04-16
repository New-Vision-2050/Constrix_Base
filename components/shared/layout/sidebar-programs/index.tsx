"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ShowSubPrograms from "./ShowSubPrograms";
import ShowMainProjects from "./ShowMainProjects";
import { SidebarProjectItem } from "@/types/sidebar-project-item";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";

type PropsT = {
  projects: SidebarProjectItem[];
};

export function SidebarProgramsList({ projects }: PropsT) {
  // declare and define component state and variables
  const router = useRouter();
  const [activeUrl, setActiveUrl] = useState(projects?.[0]?.submenu?.[0]?.url);
  const [activeProject, setActiveProject] = useState<SidebarProjectItem>(
    projects[0]
  );

  //  declare and define helper methods
  const handleSubMenuItemClick = (url: string) => {
    setActiveUrl(url);
    router.push(url);
  };

  // return component ui.
  return (
    <SidebarGroup>
      <SidebarMenu>
        <ShowMainProjects
          projects={projects}
          activeProject={activeProject}
          setActiveProject={setActiveProject}
        />

        <ShowSubPrograms
          activeProject={activeProject}
          activeUrl={activeUrl ?? ""}
          handleSubMenuItemClick={handleSubMenuItemClick}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
