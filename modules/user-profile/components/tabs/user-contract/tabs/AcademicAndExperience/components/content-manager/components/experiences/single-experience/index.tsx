import SingleExperienceEditMode from "./SingleExperienceEditMode";
import SingleExperiencePreviewMode from "./SingleExperiencePreviewMode";
import { Experience } from "@/modules/user-profile/types/experience";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { apiClient } from "@/config/axios-config";

type PropsT = { experience: Experience };

export default function SingleExperience({ experience }: PropsT) {
  // declare and define component state and vars
  const { handleRefetchUserExperiences } = useUserAcademicTabsCxt();

  // declare and define component methods
  const handleDelete = async () => {
    await apiClient
      .delete(`/user_experiences/${experience?.id}`)
      .then(() => {
        handleRefetchUserExperiences();
      })
      .catch((err) => {
        console.log("delete bank error", err);
      });
  };

  // return component ui
  return (
    <TabTemplate
      title={experience?.job_name ?? ""}
      reviewMode={<SingleExperiencePreviewMode experience={experience} />}
      editMode={<SingleExperienceEditMode experience={experience} />}
      settingsBtn={{
        items: [
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
