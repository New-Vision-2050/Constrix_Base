import HorizontalTabs from "@/components/shared/HorizontalTabs";
import { BriefcaseBusiness, UserRound, UsersRound, FolderKanban } from "lucide-react";
import { useTranslations } from "next-intl";
import PublicDocsTab from "../../modules/publicDocs/views/public-docs-tab";
import EmpsDocsTab from "../../modules/empsDocs/views/emps-docs-tab";
import ProjectsDocsTab from "../../modules/projectsDocs/views/projects-docs-tab";

export default function DocsTypesTabs() {
  const t = useTranslations("docs-library.tabsTitles");
  const createBrokerTabs = [
    {
      id: "publicDocs",
      title: t("publicDocs"),
      content: <PublicDocsTab />,
      icon: <UserRound />,
    },
    {
      id: "empsDocs",
      title: t("empsDocs"),
      content: <EmpsDocsTab />,
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
    {
      id: "projectsDocs",
      title: t("projectsDocs"),
      content: <ProjectsDocsTab />,
      icon: <FolderKanban />,
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
