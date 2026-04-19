"use client";

import * as React from "react";
import { Settings, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "@i18n/navigation";
import { ROUTER } from "@/router";

import { useSidebarMenu } from "@/hooks/useSidebarMenu";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { Menu, Project } from "@/types/sidebar-menu";
import type { Entity } from "@/types/sidebar-menu";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { createPermissions } from "@/lib/permissions/permission-names/default-permissions";
import { SidebarProgramsListV2 } from "./sidebar-programs-v2";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";

import SidebarFooterContent from "./sidebar-footer-content";
import { AvatarGroup } from "../avatar-group";
import { useAuthStore } from "@/modules/auth/store/use-auth";
import Image from "next/image";
import LogoPlaceholder from "@/public/images/logo-placeholder-image.png";
import useCurrentAuthCompany from "@/hooks/use-auth-company";
import CrmInboxIconWithCount from "@/components/icons/crm-inbox";
import { useSidebarProjects } from "@/hooks/use-sidebar-projects";

interface SidebarContentWrapperProps {
  name?: string;
  serialNumber?: string;
  mainLogo?: string;
  userTypes: UserRoleType[];
  showHeader?: boolean;
  showFooter?: boolean;
}

export function SidebarContentWrapper({
  name,
  serialNumber,
  mainLogo,
  userTypes,
  showHeader = true,
  showFooter = true,
}: SidebarContentWrapperProps) {
  const { isLoading, data } = useSidebarMenu();
  const t = useTranslations();
  const path = usePathname();
  const pageName = "/" + path.split("/").at(-1);
  const p = usePermissions(),
    { can, isCentralCompany, isSuperAdmin } = p;
  const user = useAuthStore((state) => state.user);

  const { data: companyRes } = useCurrentAuthCompany();
  const company = companyRes?.payload;
  const displaySerialNumber = serialNumber || company?.serial_no;

  // Helper to get pathname without locale prefix
  const getPathnameWithoutLocale = React.useCallback((pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    // Remove locale (first segment like 'ar', 'en')
    if (segments.length > 0 && segments[0].length === 2) {
      return "/" + segments.slice(1).join("/");
    }
    return pathname;
  }, []);

  const fullPath = getPathnameWithoutLocale(path);

  const mergeProjectsAndMenu = React.useCallback(
    function (
      projects: Project[],
      menu: Menu[],
      isSuperAdmin?: boolean,
    ): Project[] {
      const formatted: Project[] = projects.map((project) => {
        if (project.slug === SUPER_ENTITY_SLUG.SETTINGS) {
          if (!isSuperAdmin) {
            return project;
          }
        }
        const matchedMenu = menu.find(
          (menuItem) => menuItem.slug === project.slug,
        );

        if (!matchedMenu) return project;

        const { sub_entities: menuSubEntities, ...restMenuProps } = matchedMenu;

        const transformedMenuSubEntities =
          menuSubEntities?.map((menuSubEntity): Entity => {
            return {
              name: menuSubEntity.name,
              icon: menuSubEntity.icon,
              slug: menuSubEntity.slug,
              origin_super_entity: menuSubEntity.origin_super_entity,
              url: `/${project.slug}/${menuSubEntity.slug}`,
              show: can((permissions) =>
                permissions.some(
                  (permission) =>
                    permission.key ===
                    createPermissions(`DYNAMIC.${menuSubEntity.slug}`, ["LIST"])
                      .list,
                ),
              ),
            };
          }) || [];

        // For CRM, append Price Offers and Settings at the end after API sub-entities
        if (project.slug === SUPER_ENTITY_SLUG.CRM) {
          const clientRequests = {
            name: t("Sidebar.ClientRequests"),
            url: ROUTER.CRM.clientRequests,
            icon: FileText,
            isActive: fullPath === ROUTER.CRM.clientRequests,
            show: !isCentralCompany,
          };

          const priceOffers = {
            name: t("Sidebar.PricesOffers"),
            url: ROUTER.CRM.pricesOffers,
            icon: FileText,
            isActive: fullPath === ROUTER.CRM.pricesOffers,
            show: !isCentralCompany && can([PERMISSIONS.crm.pricesOffers.list]),
          };

          const crmSettings = {
            name: t("Sidebar.CRMSettings"),
            url: ROUTER.CRM.settings,
            icon: Settings,
            isActive: pageName === ROUTER.CRM.settings,
            show: !isCentralCompany && can([PERMISSIONS.crm.settings.update]),
          };

          const crmInbox = {
            name: t("Sidebar.Inbox"),
            url: ROUTER.CRM.inbox,
            icon: CrmInboxIconWithCount,
            isActive:
              fullPath === ROUTER.CRM.inbox ||
              fullPath.startsWith(`${ROUTER.CRM.inbox}/`),
            show: !isCentralCompany && can([PERMISSIONS.clientRequest.list]),
          };

          return {
            ...project,
            ...restMenuProps,
            sub_entities: [
              ...transformedMenuSubEntities,
              clientRequests,
              priceOffers,
              crmSettings,
              crmInbox,
            ],
          };
        }

        return {
          ...project,
          ...restMenuProps,
          sub_entities: [
            ...(project.sub_entities || []),
            ...transformedMenuSubEntities,
          ],
        };
      });
      return formatted;
    },
    [can, t, pageName, fullPath, isCentralCompany],
  );

  const SidebarProjects = useSidebarProjects(userTypes);

  const all = React.useMemo(() => {
    if (isLoading) return [];
    if (!Boolean(data)) return [];
    const _mergedProjects = mergeProjectsAndMenu(
      SidebarProjects,
      data,
      isSuperAdmin,
    );
    const _shownProjects = _mergedProjects
      ?.filter((project) => {
        return project.show;
      })
      ?.filter((project) => {
        return project.sub_entities?.some((subEntity) => subEntity.show);
      });
    return _shownProjects;
  }, [SidebarProjects, isLoading, data, isSuperAdmin, mergeProjectsAndMenu]);

  return (
    <div className="flex h-full w-full flex-col bg-sidebar">
      {showHeader && (
        <div className="pt-10 px-4">
          <div className="flex items-center justify-center flex-col gap-1">
            {mainLogo ? (
              <Image
                src={mainLogo}
                alt={name || "Company Logo"}
                width={60}
                height={47}
                priority={true}
              />
            ) : (
              <Image
                src={LogoPlaceholder}
                alt={"logo placeholder"}
                width={80}
                height={47}
              />
            )}
            <p className="font-bold truncate">
              {name || t("Sidebar.CompanyName")}
            </p>
            {displaySerialNumber && (
              <p className="text-xs opacity-70 truncate font-semibold mt-1">
                {displaySerialNumber}
              </p>
            )}
          </div>
          <div className="flex gap-5 my-5 pr-5">
            <AvatarGroup
              fullName={user?.name ?? ""}
              alt={user?.name ?? ""}
              src="https://github.com/shadcn.png"
            />
            <p className="truncate">
              {t("Sidebar.Welcome")} {user?.name}
            </p>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {(isLoading || !Boolean(data)) && (
          <div className="p-4 flex justify-center">Loading...</div>
        )}
        {all && all.length > 0 && !isLoading && (
          <SidebarProgramsListV2 projects={all} />
        )}
      </div>
      {showFooter && (
        <div className="p-4">
          <SidebarFooterContent />
        </div>
      )}
    </div>
  );
}
