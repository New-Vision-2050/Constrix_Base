import SingleCoursePreviewMode from "./SingleCoursePreviewMode";
import SingleCourseEditMode from "./SingleCourseEditMode";
import { Course } from "@/modules/user-profile/types/Course";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { apiClient } from "@/config/axios-config";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import { useTranslations } from "next-intl";

type PropsT = { course: Course };

export default function SingleCourse({ course }: PropsT) {
  const t = useTranslations("GeneralActions");
  const tCompanies = useTranslations("Companies");
  // declare and define component state and vars
  const { handleRefetchUserCourses } = useUserAcademicTabsCxt();

  // declare and define component methods
  const handleDelete = async () => {
    await apiClient
      .delete(`/user_educational_courses/${course?.id}`)
      .then(() => {
        handleRefetchUserCourses();
      })
      .catch((err) => {
        console.log("delete bank error", err);
      });
  };

  // return component ui
  return (
    <TabTemplate
      title={course?.name ?? ""}
      reviewMode={<SingleCoursePreviewMode course={course} />}
      editMode={<SingleCourseEditMode course={course} />}
      settingsBtn={{
        items: [
          { title: t("MyRequests"), onClick: () => {} },
          { title: t("CreateRequest"), onClick: () => {} },
          {
            title: tCompanies("Delete"),
            onClick: () => {
              handleDelete();
            },
          },
        ],
      }}
    />
  );
}
