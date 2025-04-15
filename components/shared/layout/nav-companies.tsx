"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
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
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (name: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              className={cn(item.isActive && "bg-primary hover:bg-primary")}
              onClick={() => item.submenu && toggleSubmenu(item.name)}
            >
              <div className="pr-5 flex gap-5 items-center cursor-pointer">
                <item.icon />
                <span>{item.name}</span>
              </div>
            </SidebarMenuButton>

            {/* Submenu */}
            {item.submenu && openSubmenus[item.name] && (
              <div className="ml-8 px-2 mt-1 space-y-1">
                {item.submenu.map((sub) => (
                  <Link
                    key={sub.name}
                    href={sub.url}
                    className={`block text-md px-2 py-1 hover:bg-muted rounded transition ${
                      sub.isActive ? "text-primary" : ""
                    }`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
