import { Button } from "@/components/ui/button";
import FormFieldSet from "../../../../../components/FormFieldSet";
import PencilLineIcon from "@/public/icons/pencil-line";
import PdfViewer from "./PdfViewer";
import UploadCvDialog from "./UploadCvDialog";
import { useState } from "react";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";
import CanSeeContent from "@/components/shared/CanSeeContent";

export default function UserCV() {
  const [open, setOpen] = useState(false);
  const { userCV } = useUserAcademicTabsCxt();
  const canUpdate = can(PERMISSION_ACTIONS.UPDATE, PERMISSION_SUBJECTS.PROFILE_CV) as boolean;
  const canView = can(PERMISSION_ACTIONS.VIEW, PERMISSION_SUBJECTS.PROFILE_CV) as boolean;

  return (
    <CanSeeContent canSee={canView}>
      <div className="flex flex-col gap-6">
      <p className="text-lg font-bold text-gray-700">
        البيانات الوظيفية والتعاقدية
      </p>
      <FormFieldSet
        title={"السيرة الذاتية"}
        secondTitle={
          canUpdate && (
            <Button variant={"ghost"} onClick={() => setOpen(true)}>
              <PencilLineIcon additionalClass="text-pink-600" />
            </Button>
          )
        }
      >
        {userCV?.files ? (
          <PdfViewer src={userCV?.files?.url ?? ""} />
        ) : (
          <NoDataFounded
            title="لا يوجد بيانات"
            subTitle="لا يوجد سيرة ذاتية , قم بارفاق السيرة الذاتية"
          />
        )}
      </FormFieldSet>
      {canUpdate && (        
        <UploadCvDialog open={open} setOpen={setOpen} />
  )}
    </div>
</CanSeeContent>
  );
}
