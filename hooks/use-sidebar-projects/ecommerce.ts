import { UserIcon } from "lucide-react";
import SettingsIcon from "@/public/icons/settings";
import { ROUTER } from "@/router";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { Project } from "@/types/sidebar-menu";
import { SidebarProjectProps } from "./types";

export function getEcommerceProject({
  t,
  pageName,
  can,
  isCentralCompany,
}: SidebarProjectProps): Project {
  return {
    name: t("Sidebar.ecommerce"),
    icon: SettingsIcon,
    isActive: [
      ROUTER.HomeStore,
      ROUTER.Products,
      ROUTER.Brands,
      ROUTER.Categories,
      ROUTER.Terms,
      ROUTER.warehouse,
      ROUTER.Discounts,
      ROUTER.Coupons,
    ].includes(pageName),
    show: !isCentralCompany,
    slug: SUPER_ENTITY_SLUG.ECOMMERCE,
    urls: [
      ROUTER.HomeStore,
      ROUTER.Products,
      ROUTER.Brands,
      ROUTER.Categories,
      ROUTER.Terms,
      ROUTER.warehouse,
      ROUTER.Discounts,
      ROUTER.Coupons,
      ROUTER.PaymentMethods,
    ],
    sub_entities: [
      {
        name: t("Sidebar.HomeStore"),
        url: ROUTER.HomeStore,
        icon: UserIcon,
        isActive: pageName === ROUTER.HomeStore,
        show:
          !isCentralCompany &&
          can(Object.values(PERMISSIONS.ecommerce.dashboard)),
      },
      {
        name: t("Sidebar.Products"),
        url: ROUTER.Products,
        icon: UserIcon,
        isActive: pageName === ROUTER.Products,
        show:
          !isCentralCompany &&
          can(Object.values(PERMISSIONS.ecommerce.product)),
      },
      {
        name: t("Sidebar.Requests"),
        url: ROUTER.requests,
        icon: UserIcon,
        isActive: pageName === ROUTER.requests,
        show:
          !isCentralCompany && can(Object.values(PERMISSIONS.ecommerce.order)),
      },
      {
        name: t("Sidebar.Categories"),
        url: ROUTER.Categories,
        icon: UserIcon,
        isActive: pageName === ROUTER.Categories,
        show:
          !isCentralCompany &&
          can(Object.values(PERMISSIONS.ecommerce.category)),
      },
      {
        name: t("Sidebar.Brands"),
        url: ROUTER.Brands,
        icon: UserIcon,
        isActive: pageName === ROUTER.Brands,
        show:
          !isCentralCompany && can(Object.values(PERMISSIONS.ecommerce.brand)),
      },
      {
        name: t("Sidebar.Coupons"),
        url: ROUTER.Coupons,
        icon: UserIcon,
        isActive: pageName === ROUTER.Coupons,
        show:
          !isCentralCompany &&
          can([
            PERMISSIONS.ecommerce.coupon.list,
            PERMISSIONS.ecommerce.featureDeal.list,
            PERMISSIONS.ecommerce.flashDeal.list,
            PERMISSIONS.ecommerce.dealDay.list,
          ]),
      },
      {
        name: t("Sidebar.Warehouse"),
        url: ROUTER.warehouse,
        icon: UserIcon,
        isActive: pageName === ROUTER.warehouse,
        show:
          !isCentralCompany &&
          can(Object.values(PERMISSIONS.ecommerce.warehouse)),
      },
      {
        name: t("Sidebar.PagesSettings"),
        url: ROUTER.pagesSettings,
        icon: UserIcon,
        isActive: pageName === ROUTER.pagesSettings,
        show:
          !isCentralCompany && can(Object.values(PERMISSIONS.ecommerce.banner)),
      },
      {
        name: t("Sidebar.Terms"),
        url: ROUTER.Terms,
        icon: UserIcon,
        isActive: pageName === ROUTER.Terms,
        show:
          !isCentralCompany && can(Object.values(PERMISSIONS.ecommerce.page)),
      },
      {
        name: t("Sidebar.SocialMedia"),
        url: ROUTER.SocialMedia,
        icon: UserIcon,
        isActive: pageName === ROUTER.SocialMedia,
        show:
          !isCentralCompany &&
          can(Object.values(PERMISSIONS.ecommerce.socialMedia)),
      },
      {
        name: t("Sidebar.PaymentMethods"),
        url: ROUTER.PaymentMethods,
        icon: UserIcon,
        isActive: pageName === ROUTER.PaymentMethods,
        show:
          !isCentralCompany &&
          can(Object.values(PERMISSIONS.ecommerce.paymentMethod)),
      },
    ],
  };
}
