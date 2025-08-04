import { useState } from "react";
import SingleCoursePreviewMode from "./SingleCoursePreviewMode";
import SingleCourseEditMode from "./SingleCourseEditMode";
import { Course } from "@/modules/user-profile/types/Course";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

type PropsT = { course: Course };

export default function SingleCourse({ course }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserCourses } = useUserAcademicTabsCxt();

  // return component ui
  return (
    <>
      <TabTemplate
        title={course?.name ?? ""}
        reviewMode={
          <Can check={[PERMISSIONS.profile.courses.view]}>
            <SingleCoursePreviewMode course={course} />
          </Can>
        }
        editMode={
          <Can check={[PERMISSIONS.profile.courses.update]}>
            <SingleCourseEditMode course={course} />
          </Can>
        }
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
            {
              title: "حذف",
              onClick: () => {
                setDeleteDialog(true);
              },
            },
          ],
        }}
      />

      <DeleteConfirmationDialog
        deleteUrl={`/user_educational_courses/${course?.id}`}
        onClose={() => setDeleteDialog(false)}
        open={deleteDialog}
        onSuccess={() => {
          handleRefetchUserCourses();
          setDeleteDialog(false);
        }}
      />
    </>
  );
}
