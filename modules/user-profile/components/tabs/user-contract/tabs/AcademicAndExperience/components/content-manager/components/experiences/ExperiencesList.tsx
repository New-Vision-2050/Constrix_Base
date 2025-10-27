import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleExperience from "./single-experience";
import { Experience } from "@/modules/user-profile/types/experience";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function ExperiencesList() {
  const { userExperiences, userExperiencesLoading } = useUserAcademicTabsCxt();
  const t = useTranslations('UserProfile.nestedTabs.academicExperience');

  // handle there is no data found
  if (
    !userExperiencesLoading &&
    userExperiences &&
    userExperiences.length === 0
  )
    return (
      <NoDataFounded
        title={t('noData')}
        subTitle={t('noDataSubTitle')}
      />
    );

  // render data
  return (
    <>
      {userExperiencesLoading ? (
        <TabTemplateListLoading />
      ) : (
        <RegularList<Experience, "experience">
          sourceName="experience"
          items={userExperiences ?? []}
          ItemComponent={SingleExperience}
        />
      )}
    </>
  );
}
