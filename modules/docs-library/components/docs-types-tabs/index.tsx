import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { BriefcaseBusiness, UserRound, UsersRound } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DocsTypesTabs() {
  const t = useTranslations("docs-library.tabsTitles");
  const createBrokerTabs = [
    {
      id: "publicDocs",
      title: t("publicDocs"),
      content: <>publicDocs</>,
      icon: <UserRound />,
    },
    {
      id: "empsDocs",
      title: t("empsDocs"),
      content: <>empsDocs</>,
      icon: <UsersRound />,
    },
    {
      id: "privateDocs",
      title: t("privateDocs"),
      content: <>privateDocs</>,
      icon: <BriefcaseBusiness />,
    },
    {
      id: "inboxDocs",
      title: t("inboxDocs"),
      content: <>inboxDocs</>,
      icon: <BriefcaseBusiness />,
    },
  ];

  return (
    <div className="pt-4">
      <HorizontalTabs
        list={createBrokerTabs}
        bgStyleApproach={true}
        additionalClassiess="justify-start"
      />
    </div>
  );
}
