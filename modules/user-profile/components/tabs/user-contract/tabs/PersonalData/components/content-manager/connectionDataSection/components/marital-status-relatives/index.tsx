import { Button } from "@/components/ui/button";
import RelativesList from "./RelativesList";
import FormFieldSet from "../../../../../../components/FormFieldSet";
import CreateRelativeDialog from "./CreateRelativeDialog";
import { useState } from "react";

export default function MaritalStatusRelativesSection() {
  const [open, setOpen] = useState(false);

  return (
    <FormFieldSet
      title="الحالة الاجتماعية / الاقارب"
      secondTitle={
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          أضافة قريب
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
