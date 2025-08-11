"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import type { BreadcrumbsProps, BreadcrumbItem } from "./types";
import { getRoutesMap } from "./routes-map";

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  homeLabel,
  className = "",
  routesMap: customRoutesMap
}) => {
  const pathname = usePathname();
  const locale = useLocale();
  
  // Get routes map based on current language
  const defaultRoutesMap = getRoutesMap(locale, t => t);
  
  // Merge custom routes map with default one
  const routesMap = { ...defaultRoutesMap, ...(customRoutesMap || {}) };
  
  // Get the default home label based on locale
  const defaultHomeLabel = locale === "ar" ? "الرئيسية" : "Home";
  const finalHomeLabel = homeLabel || defaultHomeLabel;
  
  // Skip locale segment from the pathname
  const pathWithoutLocale = pathname.replace(`/${locale}`, "");
  
  // Split the pathname into segments
  const pathSegments = pathWithoutLocale
    .split("/")
    .filter(segment => segment !== "");
  
  // Transform label for better readability
  const transformLabel = (label: string) => {
    return label
      .replace(/-/g, " ")
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  
  // Check if a segment looks like an ID (UUID, ObjectId, etc)
  const isIdLikeSegment = (segment: string): boolean => {
    // Match UUID pattern
    const uuidPattern = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
    
    // Match MongoDB ObjectId pattern (24 hex characters)
    const objectIdPattern = /^[0-9a-f]{24}$/i;
    
    // Match generic numeric ID
    const numericIdPattern = /^\d{4,}$/;
    
    return uuidPattern.test(segment) || 
           objectIdPattern.test(segment) || 
           numericIdPattern.test(segment) ||
           // If segment contains mostly numbers and special characters, likely an ID
           (segment.length > 8 && segment.replace(/[0-9\-_]/g, '').length < segment.length * 0.3);
  };
  
  // Get label for ID segments from translation file
  const getIdSegmentLabel = (): string => {
    // Get the translation key for "details" from the breadcrumbs namespace
    // We need to get this from the default routes map since it should be translated there
    if (routesMap["details"]) {
      const details = routesMap["details"];
      return typeof details === 'string' ? details : details.label;
    }
    
    // Fallback if translation key is missing
    return locale === 'ar' ? 'التفاصيل' : 'Details';
  };

  // Search in routes map for custom label for specified route
  const getRouteInfo = (segment: string, fullPath: string, index: number): { label: string, customHref?: string } => {
    // First look in the map for the full path
    if (routesMap[fullPath]) {
      const routeInfo = routesMap[fullPath];
      if (typeof routeInfo === 'string') {
        return { label: routeInfo };
      } else {
        return { label: routeInfo.label, customHref: routeInfo.href };
      }
    }
    
    // Look in the map for the current segment name
    if (routesMap[segment]) {
      const routeInfo = routesMap[segment];
      if (typeof routeInfo === 'string') {
        return { label: routeInfo };
      } else {
        return { label: routeInfo.label, customHref: routeInfo.href };
      }
    }
    
    // Check if this segment looks like an ID
    if (isIdLikeSegment(segment)) {
      // Use generic details label for any ID-like segment
      return { label: getIdSegmentLabel() };
    }
    
    // If no custom label is found, use default
    return { label: transformLabel(segment) };
  };
  
  // Generate breadcrumb items
  const breadcrumbs = [
    {
      label: finalHomeLabel,
      href: `/user-profile`,
      isActive: pathSegments.length === 0,
    },
    ...pathSegments.map((segment, index) => {
      // Build the full path without locale
      const fullPathWithoutLocale = pathSegments
        .slice(0, index + 1)
        .join("/");

      // Get custom route information from the map
      const { label, customHref } = getRouteInfo(segment, fullPathWithoutLocale, index);
      
      // Build default link if no custom link is provided
      const defaultHref = `/${locale}${pathSegments
        .slice(0, index + 1)
        .map(seg => `/${seg}`)
        .join("")}`;
        
      // Use custom link if provided
      const href = customHref || defaultHref;
        
      return {
        label, // Use custom label from getRouteInfo
        href,
        isActive: index === pathSegments.length - 1,
      };
    }),
  ];
  
  return (
    <nav aria-label="breadcrumbs" className={`breadcrumbs ${className}`}>
      <ol className="flex items-center space-x-2 rtl:space-x-reverse">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.href}>
            <li>
              {crumb.isActive ? (
                <span className="text-pink-500 font-medium">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
            
            {/* Separator between items */}
            {index < breadcrumbs.length - 1 && (
              <li className="text-gray-400">
                <span>/</span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
