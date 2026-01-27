"use client";

import TabsGroup from "@/components/shared/TabsGroup";
import { Tab } from "@/types/Tab";
import { DollarSign, Lock, MapPin, Send, User, Users } from "lucide-react";
import OfficialData from "../official-data";
import Branches from "../branches";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import {useTranslations} from "next-intl";

const CompanyProfileTabs = (): Tab[] => {
  const { can } = usePermissions();
  const t = useTranslations("companyProfile");
  const tabs: (Tab & { show: boolean })[] = [
    {
      label: t("header.placeholder.OfficialData"),
      icon: <User size={18} />,
      value: "official-data",
      component: <OfficialData />,
      show: can([
        PERMISSIONS.companyProfile.officialData.view,
        PERMISSIONS.companyProfile.legalData.view,
        PERMISSIONS.companyProfile.address.view,
        PERMISSIONS.companyProfile.supportData.view,
        PERMISSIONS.companyProfile.officialDocument.view,
      ]),
    },
    {
      label: t("header.placeholder.Branches"),
      icon: <MapPin size={18} />,
      value: "branches",
      component: <Branches />,
      show: can([PERMISSIONS.companyProfile.branch.list]),
    },
  ];

  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};

export const CompanyProfile = () => {
  return (
    <TabsGroup
      tabs={CompanyProfileTabs()}
      defaultValue="official-data"
      variant="secondary"
      tabsListClassNames="justify-start gap-20"
    />
  );
};
export const CompanyTabs = (): Tab[] => {
  const { can } = usePermissions();
  const t = useTranslations("companyProfile");
  const tabs: (Tab & { show: boolean })[] = [
    {
      label: t("header.placeholder.CompanyProfile"),
      icon: <User size={18} />,
      value: "company",
      component: <CompanyProfile />,
      show: can([
        PERMISSIONS.companyProfile.officialData.view,
        PERMISSIONS.companyProfile.legalData.view,
        PERMISSIONS.companyProfile.address.view,
        PERMISSIONS.companyProfile.supportData.view,
        PERMISSIONS.companyProfile.officialDocument.view,
        PERMISSIONS.companyProfile.branch.list,
      ]),
    },
    {
      label: t("header.placeholder.Location"),
      icon: <Users size={18} />,
      value: "location",
      show: true,
    },
    {
      label: t("header.placeholder.Projects"),
      icon: <Lock size={18} />,
      value: "projects",
      show: true,
    },
    {
      label: t("header.placeholder.Finance"),
      icon: <DollarSign size={18} />,
      value: "finance",
      show: true,
    },
    {
      label: t("header.placeholder.Leaves"),
      icon: <Send size={18} />,
      value: "leaves",
      show: true,
    },
    {
      label: t("header.placeholder.UserActions"),
      icon: <Lock size={18} />,
      value: "user-actions",
      show: true,
    },
  ];

  return tabs.filter((tab) => tab.show).map(({ show, ...rest }) => rest);
};
