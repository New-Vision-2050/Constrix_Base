import UserCertificationPreview from "./UserCertificationPreview";
import UserCertificationEdit from "./UserCertificationEdit";
import { Certification } from "@/modules/user-profile/types/Certification";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { apiClient } from "@/config/axios-config";
import { useTranslations } from "next-intl";

type PropsT = { certification: Certification };

export default function UserCertification({ certification }: PropsT) {
  const t = useTranslations("GeneralActions");
  const tCompanies = useTranslations("Companies");
  // declare and define component state and vars
  const { handleRefetchUserCertifications } = useUserAcademicTabsCxt();

  // declare and define component methods
  const handleDelete = async () => {
    await apiClient
      .delete(`/professional_certificates/${certification?.id}`)
      .then(() => {
        handleRefetchUserCertifications();
      })
      .catch((err) => {
        console.log("delete bank error", err);
      });
  };

  // return component ui
  return (
    <TabTemplate
      title={certification?.accreditation_name ?? ""}
      reviewMode={<UserCertificationPreview certification={certification} />}
      editMode={<UserCertificationEdit certification={certification} />}
      settingsBtn={{
        items: [
          { title: t("MyRequests"), onClick: () => {} },
          { title: t("CreateRequest"), onClick: () => {} },
          {
            title: tCompanies("Delete"),
            onClick: () => {
              handleDelete();
            },
          },
        ],
      }}
    />
  );
}
