"use client";

import { useCallback, useEffect, useState } from "react";
import ShowSubPrograms from "./ShowSubPrograms";
import ShowMainProjects from "./ShowMainProjects";
import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { Project } from "@/types/sidebar-menu";

type PropsT = {
  projects: Project[];
};

export function SidebarProgramsList({ projects }: PropsT) {
  // declare and define component state and variables
  const pathname = window.location.pathname;
  const [activeUrl, setActiveUrl] = useState(
    pathname != "/login" ? pathname : projects?.[0]?.sub_entities?.[0]?.url
  );
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  // handle side effects
  useEffect(() => {
    if (pathname != "/login") {
      const project = projects.find(
        (project) => project.urls?.indexOf(pathname) !== -1
      );

      if (project) {
        setActiveProject(project);
        setActiveUrl(pathname);
      }
    }
  }, [pathname, projects]);

  //  declare and define helper methods
  const handleSub_entitiesItemClick = useCallback((url: string) => {
    setActiveUrl(url);
  }, []);

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
          handleSub_entitiesItemClick={handleSub_entitiesItemClick}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
