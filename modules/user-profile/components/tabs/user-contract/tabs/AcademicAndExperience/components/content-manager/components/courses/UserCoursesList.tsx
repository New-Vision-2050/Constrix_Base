import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleCourse from "./single-course";
import { Course } from "@/modules/user-profile/types/Course";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { useTranslations } from "next-intl";

export default function UserCoursesList() {
  const { userCourses } = useUserAcademicTabsCxt();
  const t = useTranslations("AcademicExperience");

  // handle there is no data found
  if (userCourses && userCourses.length === 0)
    return (
      <NoDataFounded
        title={t("NoDataFound")}
        subTitle={t("NoCoursesData")}
      />
    );

  // render data
  return (
    <RegularList<Course, "course">
      sourceName="course"
      items={userCourses ?? []}
      ItemComponent={SingleCourse}
    />
  );
}
