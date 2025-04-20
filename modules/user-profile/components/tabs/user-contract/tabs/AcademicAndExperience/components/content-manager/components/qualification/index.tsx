import { Button } from "@/components/ui/button";
import SingleQualificationData from "./SingleQualificationData";
import CreateQualificationDialog from "./CreateQualificationDialog";
import { useState } from "react";
import RegularList from "@/components/shared/RegularList";
import { Qualification } from "@/modules/user-profile/types/qualification";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";

export default function UserQualificationData() {
  const [open, setOpen] = useState(false);
  const { userQualifications } = useUserAcademicTabsCxt();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">المؤهل</p>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          اضافة مؤهل
        </Button>
      </div>
      <CreateQualificationDialog open={open} setOpen={setOpen} />
      <RegularList<Qualification, "qualification">
        sourceName="qualification"
        ItemComponent={SingleQualificationData}
        items={userQualifications ?? []}
      />
    </div>
  );
}
