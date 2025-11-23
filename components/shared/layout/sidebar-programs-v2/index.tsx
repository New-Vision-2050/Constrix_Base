"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { SidebarGroup, SidebarMenu, useSidebar } from "@/components/ui/sidebar";
import { Project } from "@/types/sidebar-menu";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { MainProjectSelector } from "./MainProjectSelector";
import { SubProgramsList } from "./SubProgramsList";

type PropsT = {
  projects: Project[];
};

export function SidebarProgramsListV2({ projects }: PropsT) {
  const { open } = useSidebar();
  const pathname = usePathname();

  // Memoized initial active project based on pathname
  const initialActiveProject = useMemo(() => {
    if (pathname === "/login") return projects[0];

    const matchedProject = projects.find((project) =>
      project.urls?.includes(pathname)
    );
    return matchedProject || projects[0];
  }, [pathname, projects]);

  // State management
  const [activeProject, setActiveProject] =
    useState<Project>(initialActiveProject);
  const [activeUrl, setActiveUrl] = useState<string>(
    pathname !== "/login"
      ? pathname
      : projects?.[0]?.sub_entities?.[0]?.url ?? ""
  );

  // Sync active project when pathname changes
  useEffect(() => {
    if (pathname === "/login") return;

    const matchedProject = projects.find((project) =>
      project.urls?.includes(pathname)
    );

    if (matchedProject) {
      setActiveProject(matchedProject);
      setActiveUrl(pathname);
    }
  }, [pathname, projects]);

  // Handle sub-entity click
  const handleSubEntityClick = useCallback((url: string) => {
    setActiveUrl(url);
  }, []);

  // Handle project change
  const handleProjectChange = useCallback((project: Project) => {
    setActiveProject(project);
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* Main Project Selector with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key="main-projects"
            animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
            initial={false}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <MainProjectSelector
              projects={projects}
              activeProject={activeProject}
              onProjectChange={handleProjectChange}
              onSubEntityClick={handleSubEntityClick}
            />
          </motion.div>
        </AnimatePresence>

        {/* Sub Programs List */}
        <SubProgramsList
          activeProject={activeProject}
          activeUrl={activeUrl}
          onSubEntityClick={handleSubEntityClick}
        />
      </SidebarMenu>
    </SidebarGroup>
  );
}
