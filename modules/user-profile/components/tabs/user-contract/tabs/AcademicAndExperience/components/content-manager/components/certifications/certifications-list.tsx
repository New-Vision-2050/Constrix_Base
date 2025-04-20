import RegularList from "@/components/shared/RegularList";
import UserCertification from "./single-certification";
import { Certification } from "@/modules/user-profile/types/Certification";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";

export default function UserCertificationsList() {
  const { userCertifications } = useUserAcademicTabsCxt();

  return (
    <>
      <RegularList<Certification, "certification">
        sourceName="certification"
        items={userCertifications ?? []}
        ItemComponent={UserCertification}
      />
    </>
  );
}
