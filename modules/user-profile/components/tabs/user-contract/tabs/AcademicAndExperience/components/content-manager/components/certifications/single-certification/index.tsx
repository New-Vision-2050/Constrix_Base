import UserCertificationPreview from "./UserCertificationPreview";
import UserCertificationEdit from "./UserCertificationEdit";
import { Certification } from "@/modules/user-profile/types/Certification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { apiClient } from "@/config/axios-config";

type PropsT = { certification: Certification };

export default function UserCertification({ certification }: PropsT) {
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
          { title: "طلباتي", onClick: () => {} },
          { title: "أنشاء طلب", onClick: () => {} },
          {
            title: "حذف",
            onClick: () => {
              handleDelete();
            },
          },
        ],
      }}
    />
  );
}
