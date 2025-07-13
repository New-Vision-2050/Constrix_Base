import { Button } from "@/components/ui/button";
import RelativesList from "./RelativesList";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import CreateRelativeDialog from "./CreateRelativeDialog";
import { useState } from "react";
import { can } from "@/hooks/useCan";
import { PERMISSION_ACTIONS, PERMISSION_SUBJECTS } from "@/modules/roles-and-permissions/permissions";

export default function MaritalStatusRelativesSection() {
  const permissions = can([PERMISSION_ACTIONS.CREATE , PERMISSION_ACTIONS.UPDATE] , PERMISSION_SUBJECTS.PROFILE_MARITAL_STATUS) as {
    CREATE: boolean;
    UPDATE: boolean;
  };

  const [open, setOpen] = useState(false);

  return (
    <FormFieldSet
      title="الحالة الاجتماعية / الاقارب"
      secondTitle={
        permissions.CREATE ? (
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            أضافة قريب
          </Button>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-5">
        <RelativesList />
      </div>
      {permissions.CREATE && (
        <CreateRelativeDialog open={open} setOpen={setOpen} />
      )}
    </FormFieldSet>
  );
}
