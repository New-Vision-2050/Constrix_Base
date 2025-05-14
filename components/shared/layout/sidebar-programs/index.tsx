"use client";

import { useEffect, useState } from "react";
import ShowSubPrograms from "./ShowSubPrograms";
import ShowMainProjects from "./ShowMainProjects";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { Project } from "@/types/sidebar-menu";

type PropsT = {
  projects: Project[];
};

export function SidebarProgramsList({ projects }: PropsT) {
  // declare and define component state and variables
  const [activeUrl, setActiveUrl] = useState(
    projects?.[0]?.sub_entities?.[0]?.url
  );
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  //  declare and define helper methods
  const handlesub_entitiesItemClick = (url: string) => {
    setActiveUrl(url);
  };

  useEffect(() => {
    setActiveProject(projects[0]);
    setActiveUrl(projects?.[0]?.sub_entities?.[0]?.url);
  }, [projects]);

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
          handleSub_entitiesItemClick={handlesub_entitiesItemClick}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
