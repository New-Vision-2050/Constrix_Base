import UserCertificationPreview from "./UserCertificationPreview";
import UserCertificationEdit from "./UserCertificationEdit";
import { Certification } from "@/modules/user-profile/types/Certification";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";

type PropsT = { certification: Certification };

export default function UserCertification({ certification }: PropsT) {
  return (
    <TabTemplate
      title={certification?.accreditation_name ?? ""}
      reviewMode={<UserCertificationPreview certification={certification} />}
      editMode={<UserCertificationEdit certification={certification} />}
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} },
          { title: "أنشاء طلب", onClick: () => {} },
        ],
      }}
    />
  );
}
