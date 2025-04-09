"use client";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NavCompanies({
  projects,
  isCentral,
}: {
  isCentral: boolean;
  projects: {
    name: string;
    url: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
    central: boolean;
  }[];
}) {
  const allProject = isCentral
    ? projects
    : projects.filter((project) => !!project.central);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {allProject.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              tooltip={item.name}
              className={cn(item.isActive && "bg-primary hover:bg-primary")}
            >
              <Link href={item.url} className="pr-5 flex gap-5">
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
