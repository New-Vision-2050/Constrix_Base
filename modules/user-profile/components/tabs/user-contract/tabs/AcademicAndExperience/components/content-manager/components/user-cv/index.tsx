import { Button } from "@/components/ui/button";
import FormFieldSet from "../../../../../components/FormFieldSet";
import PencilLineIcon from "@/public/icons/pencil-line";
import PdfViewer from "./PdfViewer";
import UploadCvDialog from "./UploadCvDialog";
import { useState } from "react";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";

export default function UserCV() {
  const [open, setOpen] = useState(false);
  const { userCV } = useUserAcademicTabsCxt();

  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-bold text-gray-700">
        البيانات الوظيفية والتعاقدية
      </p>
      <FormFieldSet
        title={"السيرة الذاتية"}
        secondTitle={
          <Button variant={"ghost"} onClick={() => setOpen(true)}>
            <PencilLineIcon additionalClass="text-pink-600" />
          </Button>
        }
      >
        {userCV?.files && <PdfViewer src={userCV?.files ?? ""} />}
      </FormFieldSet>
      <UploadCvDialog open={open} setOpen={setOpen} />
    </div>
  );
}
