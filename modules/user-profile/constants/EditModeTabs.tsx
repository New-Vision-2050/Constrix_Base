import { SystemTab } from '@/modules/settings/types/SystemTab'
import UserContractTab from '../components/tabs/user-contract'
import UserProfileTab from '../components/tabs/user-profile'
import UserActionsTabs from '../components/tabs/user-actions'

export const getEditModeTabsList = (
  t: (key: string) => string
): SystemTab[] => [
  {
    id: "edit-mode-tabs-profile",
    title: t("profile"),
    content: <UserProfileTab />,
  },
  {
    id: "edit-mode-tabs-contract",
    title: t("contract"),
    content: <UserContractTab />,
  },
  {
    id: "edit-mode-tabs-attendance",
    title: t("attendance"),
    content: <>سياسة الحضور</>,
  },
  {
    id: "edit-mode-tabs-logs",
    title: t("usersActions"),
    content: <UserActionsTabs />,
  },
];
