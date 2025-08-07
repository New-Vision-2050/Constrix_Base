"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BreadcrumbsProps, BreadcrumbItem } from "../types";
import { useBreadcrumbs } from "../context/useBreadcrumbs";
import { useRouter } from "next/navigation";

/**
 * A component for an individual breadcrumb link that handles navigation and state updates
 */
const BreadcrumbLink = ({ item, index }: { item: BreadcrumbItem, index: number }) => {
  const router = useRouter();
  const { addBreadcrumb } = useBreadcrumbs();
  
  // Handle breadcrumb click
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Update the breadcrumbs state by "re-adding" this breadcrumb
    // This will trigger the reducer to remove all items after this one
    addBreadcrumb(item);
    
    // Navigate to the page
    router.push(item.href);
  };
  
  return (
    <a
      href={item.href}
      onClick={handleClick}
      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 
                dark:hover:text-blue-300 transition-colors cursor-pointer"
    >
      {item.icon && <span className="mr-1">{item.icon}</span>}
      {item.label}
    </a>
  );
};

/**
 * Client-side Breadcrumbs component with interactive features
 * If no items are provided, it will use the breadcrumbs from context
 */
export function Breadcrumbs({
  showHomeLink = true,
  className = "",
}: BreadcrumbsProps) {
  const t = useTranslations("breadcrumbs");
  const separator = t("separator");
  const router = useRouter();
  const { breadcrumbs: contextBreadcrumbs, resetBreadcrumbs } = useBreadcrumbs();

  // Use breadcrumbs from context
  const items = contextBreadcrumbs;
  
  // Handle home link click
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    resetBreadcrumbs();
    router.push("/user-profile");
  };

  return (
    <nav aria-label="breadcrumbs" className={`py-2 ${className}`}>
      <ol className="flex flex-wrap items-center text-sm">
        {showHomeLink && (
          <li className="flex items-center">
            <a
              href="/user-profile"
              onClick={handleHomeClick}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 
                        dark:hover:text-blue-300 transition-colors"
            >
              <HomeIcon className="inline-block w-4 h-4 mr-1" />
              <span>{t("home")}</span>
            </a>
            {items.length > 0 && (
              <span className="mx-2 text-gray-500 dark:text-gray-400">
                {separator}
              </span>
            )}
          </li>
        )}

        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {item.isCurrent ? (
              <span className="text-gray-500 dark:text-gray-400 font-semibold">
                {item.label}
              </span>
            ) : (
              <BreadcrumbLink item={item} index={index} />
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-500 dark:text-gray-400">
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M10 3L4 9h3v8h6V9h3L10 3z" />
    </svg>
  );
}
