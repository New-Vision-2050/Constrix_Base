import { useState } from "react";
import SingleCoursePreviewMode from "./SingleCoursePreviewMode";
import SingleCourseEditMode from "./SingleCourseEditMode";
import { Course } from "@/modules/user-profile/types/Course";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

type PropsT = { course: Course };

export default function SingleCourse({ course }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserCourses } = useUserAcademicTabsCxt();

  const canUpdate = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_COURSES) as boolean;
  const canDelete = can(PERMISSION_ACTIONS.DELETE, PERMISSION_SUBJECTS.PROFILE_COURSES) as boolean;

  // return component ui
  return (
    <>
      <TabTemplate
        title={course?.name ?? ""}
        reviewMode={<SingleCoursePreviewMode course={course} />}
        editMode={<SingleCourseEditMode course={course} />}
        canEdit={canUpdate}
        settingsBtn={{
          items: [
            { title: "طلباتي", onClick: () => {}, disabled: true },
            { title: "أنشاء طلب", onClick: () => {}, disabled: true },
            ...(canDelete ? [{
              title: "حذف",
              onClick: () => {
                setDeleteDialog(true);
              },
            }] : []),
          ],
        }}
      />

      {canDelete && (
        <DeleteConfirmationDialog
          deleteUrl={`/user_educational_courses/${course?.id}`}
          onClose={() => setDeleteDialog(false)}
          open={deleteDialog}
          onSuccess={() => {
            handleRefetchUserCourses();
            setDeleteDialog(false);
          }}
        />
      )}
    </>
  );
}
