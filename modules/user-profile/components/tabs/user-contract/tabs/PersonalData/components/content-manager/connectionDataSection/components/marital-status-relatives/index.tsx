import { Button } from "@/components/ui/button";
import RelativesList from "./RelativesList";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import CreateRelativeDialog from "./CreateRelativeDialog";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function MaritalStatusRelativesSection() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("UserProfile.tabs.CommonSections");

  return (
    <FormFieldSet
      title={t("maritalStatusData")}
      secondTitle={
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("addNewRelative")}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <RelativesList />
      </div>
      <CreateRelativeDialog open={open} setOpen={setOpen} />
    </FormFieldSet>
  );
}
