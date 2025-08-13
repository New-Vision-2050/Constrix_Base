import { Button } from "@/components/ui/button";
import FormFieldSet from "../../../../../components/FormFieldSet";
import PencilLineIcon from "@/public/icons/pencil-line";
import PdfViewer from "./PdfViewer";
import UploadCvDialog from "./UploadCvDialog";
import { useState } from "react";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import NoDataFounded from "@/modules/user-profile/components/NoDataFounded";

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
        {userCV?.files ? (
          <PdfViewer src={userCV?.files?.url ?? ""} />
        ) : (
          <NoDataFounded
            title="لا يوجد بيانات"
            subTitle="لا يوجد سيرة ذاتية , قم بارفاق السيرة الذاتية"
          />
        )}
      </FormFieldSet>
      <UploadCvDialog open={open} setOpen={setOpen} />
    </div>
  );
}
