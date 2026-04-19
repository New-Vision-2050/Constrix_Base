"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@i18n/navigation";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { UsersRole } from "@/constants/users-role.enum";
import { ROUTER } from "@/router";
import { UserRoleType } from "@/app/[locale]/(main)/client-profile/[id]/types";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";
import { getWorkPanelProject } from "./work-panel";
import { getCompaniesProject } from "./companies";
import { getUsersProject } from "./users";
import { getHumanResourcesProject } from "./human-resources";
import { getProgramManagementProject } from "./program-management";
import { getCrmProject } from "./crm";
import { getDocsLibraryProject } from "./docs-library";
import { getSettingsProject } from "./settings";
import { getPowersProject } from "./powers";
import { getEcommerceProject } from "./ecommerce";
import { getCmsProject } from "./cms";

export function useSidebarProjects(userTypes: UserRoleType[]): Project[] {
  const t = useTranslations();
  const path = usePathname();
  const { can, isCentralCompany } = usePermissions();
  const pageName = "/" + path.split("/").at(-1);

  const getPathnameWithoutLocale = React.useCallback((pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && segments[0].length === 2) {
      return "/" + segments.slice(1).join("/");
    }
    return pathname;
  }, []);

  const fullPath = getPathnameWithoutLocale(path);

  const userProfileUrl = React.useMemo(() => {
    const isEmployee = userTypes.some(
      (userType) => userType.role == UsersRole.Employee,
    );
    const isBroker = userTypes.some(
      (userType) => userType.role == UsersRole.Broker,
    );
    const isClient = userTypes.some(
      (userType) => userType.role == UsersRole.Client,
    );
    if (userTypes.length > 0) {
      if (isEmployee) {
        return ROUTER.USER_PROFILE;
      } else if (isBroker || isClient) {
        return ROUTER.CLIENT_PROFILE;
      }
    }
    return `${ROUTER.CLIENT_PROFILE}?readonly=true`;
  }, [userTypes]);

  return React.useMemo((): Project[] => {
    const props: SidebarProjectProps = {
      t,
      pageName,
      fullPath,
      path,
      can,
      isCentralCompany,
      userProfileUrl,
    };

    return [
      getWorkPanelProject(props),
      getCompaniesProject(props),
      getUsersProject(props),
      getHumanResourcesProject(props),
      getProgramManagementProject(props),
      getCrmProject(props),
      getDocsLibraryProject(props),
      getSettingsProject(props),
      getPowersProject(props),
      getEcommerceProject(props),
      getCmsProject(props),
    ];
  }, [pageName, path, fullPath, isCentralCompany, can, t, userProfileUrl]);
}
