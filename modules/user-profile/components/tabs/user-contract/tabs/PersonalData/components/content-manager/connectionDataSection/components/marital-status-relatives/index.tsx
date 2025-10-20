import { Button } from "@/components/ui/button";
import RelativesList from "./RelativesList";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import CreateRelativeDialog from "./CreateRelativeDialog";
import { useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { useTranslations } from "next-intl";

export default function MaritalStatusRelativesSection() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("UserProfile.nestedTabs.maritalStatusRelatives");

  return (
    <FormFieldSet
      title={t("title")}
      secondTitle={
        <Can check={[PERMISSIONS.profile.maritalStatus.create]}>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("createRelative")}
          </Button>
        </Can>
      }
    >
      <div className="flex flex-col gap-5">
        <Can check={[PERMISSIONS.profile.maritalStatus.view]}>
          <RelativesList />
        </Can>
      </div>
      <CreateRelativeDialog open={open} setOpen={setOpen} />
    </FormFieldSet>
  );
}
