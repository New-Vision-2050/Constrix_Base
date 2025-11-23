"use client";

import { cn } from "@/lib/utils";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { tableIcon } from "@/modules/program-settings/users-settings/tableIcon";
import React, { memo } from "react";
import Link from "next/link";
import { Project } from "@/types/sidebar-menu";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

type SubProgramsListProps = {
  activeUrl: string;
  activeProject: Project;
  onSubEntityClick: (url: string) => void;
};

type IconKey = keyof typeof tableIcon;

function isValidIconKey(key: string): key is IconKey {
  return key in tableIcon;
}

export const SubProgramsList = memo(function SubProgramsList({
  activeProject,
  activeUrl,
  onSubEntityClick,
}: SubProgramsListProps) {
  const { open } = useSidebar();
  const t = useTranslations();
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDarkMode = currentTheme === "dark";

  const visibleSubEntities = activeProject?.sub_entities?.filter(
    (item) => item.show
  ) ?? [];

  if (!visibleSubEntities.length) return null;

  return (
    <div className="w-full mt-4">
      {/* Label with animation */}
      <motion.div
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        initial={false}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
      >
        <label
          className={cn(
            "block mb-3 px-2 text-sm font-medium",
            isDarkMode ? "text-gray-300" : "text-gray-700"
          )}
        >
          {t("Sidebar.subPrograms")}
        </label>
      </motion.div>

      {/* Sub Programs Menu List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="space-y-1"
      >
        {visibleSubEntities.map((sub, index) => {
          const subUrl = sub.url || `/${activeProject?.slug}/${sub.slug}`;
          const isActive = subUrl === activeUrl;

          return (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <SidebarMenuButton
                asChild
                tooltip={sub.name}
                className={cn(
                  "relative overflow-hidden transition-all duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  isActive && [
                    "text-purple-600 dark:text-purple-400",
                    "bg-purple-50 dark:bg-purple-950/30",
                    "font-semibold",
                    "before:absolute before:left-0 before:top-0 before:bottom-0",
                    "before:w-1 before:bg-purple-600 before:rounded-r-full",
                  ]
                )}
                onClick={() => onSubEntityClick(subUrl)}
              >
                <Link
                  href={subUrl}
                  className={cn(
                    "flex gap-3 items-center cursor-pointer",
                    "px-4 py-2.5 rounded-md w-full",
                    "group transition-all duration-200",
                    isActive && "pl-6"
                  )}
                >
                  {/* Icon */}
                  {sub.icon && (
                    <span
                      className={cn(
                        "flex-shrink-0 transition-transform duration-200",
                        "group-hover:scale-110",
                        isActive && "text-purple-600 dark:text-purple-400"
                      )}
                    >
                      {typeof sub.icon !== "string" ? (
                        <sub.icon />
                      ) : isValidIconKey(sub.icon) ? (
                        React.createElement(tableIcon[sub.icon], {
                          className: cn(
                            "w-5 h-5 transition-colors",
                            isActive
                              ? "fill-purple-600 dark:fill-purple-400"
                              : "fill-gray-700 dark:fill-gray-300"
                          ),
                        })
                      ) : (
                        <span className="w-5 h-5 flex items-center justify-center text-xs">
                          •
                        </span>
                      )}
                    </span>
                  )}

                  {/* Text */}
                  <span
                    className={cn(
                      "flex-1 truncate text-sm transition-colors",
                      isActive
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {sub.name}
                  </span>
                </Link>
              </SidebarMenuButton>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});


