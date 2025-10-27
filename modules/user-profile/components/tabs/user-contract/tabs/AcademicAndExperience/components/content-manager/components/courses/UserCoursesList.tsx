import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleCourse from "./single-course";
import { Course } from "@/modules/user-profile/types/Course";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import TabTemplateListLoading from "@/modules/user-profile/components/TabTemplateListLoading";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function UserCoursesList() {
  const { userCourses, userCoursesLoading } = useUserAcademicTabsCxt();

  // handle there is no data found
  if (!userCoursesLoading && userCourses && userCourses.length === 0)
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بيانات تخص الكورسات للمستخدم قم باضافة كورس / دورة"
      />
    );

  // render data
  return (
    <>
      {userCoursesLoading ? (
        <TabTemplateListLoading />
      ) : (
        <Can check={[PERMISSIONS.profile.courses.view]}>
          <RegularList<Course, "course">
            sourceName="course"
            items={userCourses ?? []}
            ItemComponent={SingleCourse}
          />
        </Can>
      )}
    </>
  );
}
