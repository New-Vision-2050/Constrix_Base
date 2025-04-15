import RegularList from "@/components/shared/RegularList";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import SingleCourse from "./single-course";
import { Course } from "@/modules/user-profile/types/Course";

export default function UserCoursesList() {
  const { userCourses } = useUserAcademicTabsCxt();
  return (
    <RegularList<Course, "course">
      sourceName="course"
      items={userCourses ?? []}
      ItemComponent={SingleCourse}
    />
  );
}
