import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import FormFieldSet from "../../../../../components/FormFieldSet";
import PencilLineIcon from "@/public/icons/pencil-line";
import PdfViewer from "./PdfViewer";
import UploadCvDialog from "./UploadCvDialog";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

export default function UserCV() {
  const t = useTranslations("UserProfile.nestedTabs.userCV");
  const [open, setOpen] = useState(false);
  const { userCV } = useUserAcademicTabsCxt();

  return (
    <div className="flex flex-col gap-6">
      <FormFieldSet
        title={t("cvTitle")}
        secondTitle={
          <Can check={[PERMISSIONS.profile.cv.update]}>
            <Button variant={"ghost"} onClick={() => setOpen(true)}>
              <PencilLineIcon additionalClass="text-pink-600" />
            </Button>
          </Can>
        }
      >
        <Can check={[PERMISSIONS.profile.cv.view]}>
          {userCV?.files ? (
            <PdfViewer src={userCV?.files?.url ?? ""} />
          ) : (
            <NoDataFounded
              title={t("noData")}
              subTitle={t("noDataSubTitle")}
            />
          )}
        </Can>
      </FormFieldSet>
      <UploadCvDialog open={open} setOpen={setOpen} />
    </div>
  );
}
