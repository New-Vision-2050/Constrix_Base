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
}: {
  projects: {
    name: string;
    url: string;
    icon: React.ElementType; // Most permissive type for components
    isActive: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name} className={cn(item.isActive && 'bg-primary hover:bg-primary')}>
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
