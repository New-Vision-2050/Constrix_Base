import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";
import { Qualification } from "@/modules/user-profile/types/qualification";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { apiClient } from "@/config/axios-config";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";

type PropsT = { qualification: Qualification };
export default function SingleQualificationData({ qualification }: PropsT) {
  // declare and define component state and vars
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();

  // declare and define component methods
  const handleDelete = async () => {
    await apiClient
      .delete(`/qualifications/${qualification?.id}`)
      .then(() => {
        handleRefreshUserQualifications();
      })
      .catch((err) => {
        console.log("delete bank error", err);
      });
  };

  // return component ui
  return (
    <TabTemplate
      title={""}
      reviewMode={
        <SingleQualificationDataPreview qualification={qualification} />
      }
      editMode={
        <SingleQualificationDataEditMode qualification={qualification} />
      }
      settingsBtn={{
        items: [
          { title: "طلباتي", onClick: () => {} ,disabled:true},
          { title: "أنشاء طلب", onClick: () => {},disabled:true },
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
