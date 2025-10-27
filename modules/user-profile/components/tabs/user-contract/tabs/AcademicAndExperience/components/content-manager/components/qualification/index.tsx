import { useState } from "react";
import { Button } from "@/components/ui/button";
import QualificationsList from "./qualificationsList";
import CreateQualificationDialog from "./CreateQualificationDialog";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function UserQualificationData() {
  const [open, setOpen] = useState(false);
  const { userQualifications } = useUserAcademicTabsCxt();
  const t = useTranslations("UserProfile.nestedTabs.qualificationsData");

  return (
    <Can check={[PERMISSIONS.profile.qualification.view]}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">{t("title")}</p>
          <Can check={[PERMISSIONS.profile.qualification.create]}>
            <Button
              onClick={() => {
                setOpen(true);
              }}
            >
              {t("createQualification")}
            </Button>
          </Can>
        </div>
        <CreateQualificationDialog open={open} setOpen={setOpen} />
        <QualificationsList items={userQualifications} />
      </div>
    </Can>
  );
}
