"use client";

import { cn } from "@/lib/utils";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { tableIcon } from "@/modules/program-settings/users-settings/tableIcon";
import React from "react";
import Link from "next/link";
import { Project } from "@/types/sidebar-menu";

type PropsT = {
  activeUrl: string;
  activeProject: Project;
  handleSub_entitiesItemClick: (url: string) => void;
};

type IconKey = keyof typeof tableIcon;

function isValidIconKey(key: string): key is IconKey {
  return key in tableIcon;
}

export default function ShowSubPrograms(props: PropsT) {
  // declare and define component state and variables
  const { activeProject, activeUrl, handleSub_entitiesItemClick } = props;

  return (
    <div className="w-full">
      <label
        htmlFor="main-sidebar-item"
        className="block mb-2 px-2  text-gray-700"
      >
        البرامج الفرعية
      </label>
      {activeProject.sub_entities && (
        <div className="ml-8 px-2 mt-1 space-y-1">
          {activeProject.sub_entities.map((sub) => (
            <SidebarMenuButton
              asChild
              key={sub.name}
              tooltip={sub.name}
              className={cn(sub.url === activeUrl && "text-primary")}
              onClick={() =>
                handleSub_entitiesItemClick(
                  sub.url ? sub.url : `/${activeProject.slug}/${sub.slug}`
                )
              }
            >
              <Link
                href={sub.url ? sub.url : `/${activeProject.slug}/${sub.slug}`}
                className="pr-5 flex gap-5 items-center cursor-pointer"
              >
                {sub.icon &&
                  (typeof sub.icon !== "string" ? (
                    <sub.icon />
                  ) : isValidIconKey(sub.icon) ? (
                    React.createElement(tableIcon[sub.icon], {
                      className: "fill-black dark:fill-white",
                    })
                  ) : (
                    "i"
                  ))}
                <span>{sub.name}</span>
              </Link>
            </SidebarMenuButton>
          ))}
        </div>
      )}
    </div>
  );
}
