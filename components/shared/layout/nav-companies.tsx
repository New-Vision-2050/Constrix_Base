"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

// declare the type for the project item
type ProjectItem = {
  name: string;
  url?: string;
  icon: React.ElementType;
  isActive: boolean;
  submenu?: {
    name: string;
    url: string;
    icon?: React.ElementType;
    isActive: boolean;
  }[];
};

export function NavCompanies({ projects }: { projects: ProjectItem[] }) {
  const router = useRouter();
  const [activeUrl, setActiveUrl] = useState(projects?.[0]?.submenu?.[0]?.url);
  const [activeProject, setActiveProject] = useState<ProjectItem>(projects[0]);

  const handleSubMenuItemClick = (url: string) => {
    setActiveUrl(url);
    router.push(url);
  };

  console.log("projects", projects);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <div className="w-full">
          <label
            htmlFor="main-sidebar-item"
            className="block mb-2 px-2  text-gray-700"
          >
            البرامج الرئيسية
          </label>
          <select
            id="main-sidebar-item"
            name="main-sidebar-item"
            value={activeProject.name}
            onChange={(e) => {
              const selectedProject =
                projects.find((project) => project.name === e.target.value) ||
                projects?.[0];

              setActiveProject(selectedProject);
            }}
            className="block w-full h-[55px] px-2 py-[5px] text-[18px] font-semibold bg-[#2D174D] text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 my-[10px] border-0"
          >
            {projects.map((item) => (
              <option value={item.name} key={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full">
          <label
            htmlFor="main-sidebar-item"
            className="block mb-2 px-2  text-gray-700"
          >
            البرامج الفرعية
          </label>
          {activeProject.submenu && (
            <div className="ml-8 px-2 mt-1 space-y-1">
              {activeProject.submenu.map((sub) => (
                <SidebarMenuButton
                  asChild
                  key={sub.name}
                  tooltip={sub.name}
                  className={cn(sub.url === activeUrl && "text-primary")}
                  onClick={() => handleSubMenuItemClick(sub.url)}
                >
                  <div className="pr-5 flex gap-5 items-center cursor-pointer">
                    {sub.icon ? <sub.icon /> : "i"}
                    <span>{sub.name}</span>
                  </div>
                </SidebarMenuButton>
              ))}
            </div>
          )}
        </div>
      </SidebarMenu>
    </SidebarGroup>
  );
}
