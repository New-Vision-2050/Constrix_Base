import { useState } from "react";
import { Button } from "@/components/ui/button";
import QualificationsList from "./qualificationsList";
import CreateQualificationDialog from "./CreateQualificationDialog";
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
      <QualificationsList items={userQualifications} />
    </div>
  );
}
