import { Button } from "@/components/ui/button";
import FormFieldSet from "../../../../../components/FormFieldSet";
import PencilLineIcon from "@/public/icons/pencil-line";
import PdfViewer from "./PdfViewer";
import UploadCvDialog from "./UploadCvDialog";
import { useState } from "react";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function UserCV() {
  const [open, setOpen] = useState(false);
  const { userCV } = useUserAcademicTabsCxt();
    const t = useTranslations("UserProfile");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-bold text-gray-700">
        {t("tabs.contractTabs.cvData.cv")}
      </p>
      <FormFieldSet
        title={t("tabs.contractTabs.cvData.cv")}
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
              title={t("tabs.contractTabs.cvData.cvNoData")}
              subTitle={t("tabs.contractTabs.cvData.cvNoDataSubTitle")}
            />
          )}
        </Can>
      </FormFieldSet>
      <UploadCvDialog open={open} setOpen={setOpen} />
    </div>
  );
}
