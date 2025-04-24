"use client";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SidebarProjectItem } from "@/types/sidebar-project-item";

type PropsT = {
  activeUrl: string;
  activeProject: SidebarProjectItem;
  handleSubMenuItemClick: (url: string) => void;
};

export default function ShowSubPrograms(props: PropsT) {
  // declare and define component state and variables
  const { activeProject, activeUrl, handleSubMenuItemClick } = props;

  return (
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
              <div className="pr-5 flex gap-5 items-center cursor-pointer ">
                {sub.icon ? <sub.icon /> : "i"}
                <span>{sub.name}</span>
              </div>
            </SidebarMenuButton>
          ))}
        </div>
      )}
    </div>
  );
}
