import { useState } from "react";
import SingleCoursePreviewMode from "./SingleCoursePreviewMode";
import SingleCourseEditMode from "./SingleCourseEditMode";
import { Course } from "@/modules/user-profile/types/Course";
import TabTemplate from "@/components/shared/TabTemplate/TabTemplate";
import { useUserAcademicTabsCxt } from "../../UserAcademicTabsCxt";
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";

type PropsT = { course: Course };

export default function SingleCourse({ course }: PropsT) {
  // declare and define component state and vars
  const [deleteDialog, setDeleteDialog] = useState(false);
  const { handleRefetchUserCourses } = useUserAcademicTabsCxt();
  const { can } = usePermissions();

  // return component ui
  return (
    <>
      <Can check={[PERMISSIONS.profile.courses.view]}>
        <TabTemplate
          title={course?.name ?? ""}
          reviewMode={<SingleCoursePreviewMode course={course} />}
          editMode={<SingleCourseEditMode course={course} />}
          settingsBtn={{
            items: [
              {
                title: "طلباتي",
                onClick: () => {},
                disabled: !can([PERMISSIONS.profile.courses.update]),
              },
              {
                title: "أنشاء طلب",
                onClick: () => {},
                disabled: !can([PERMISSIONS.profile.courses.update]),
              },
              {
                title: "حذف",
                onClick: () => {
                  setDeleteDialog(true);
                },
                disabled: !can([PERMISSIONS.profile.courses.delete]),
              },
            ],
          }}
        />
      </Can>

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
