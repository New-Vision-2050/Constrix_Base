import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleCourse from "./single-course";
import { Course } from "@/modules/user-profile/types/Course";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";

export default function UserCoursesList() {
  const { userCourses } = useUserAcademicTabsCxt();

  // handle there is no data found
  if (userCourses && userCourses.length === 0)
    return (
      <NoDataFounded
        title="لا يوجد بيانات"
        subTitle="لا يوجد بيانات تخص الكورسات للمستخدم قم باضافة كورس / دورة"
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
