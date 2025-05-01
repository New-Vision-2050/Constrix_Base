import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CloudUploadIcon from "@/public/icons/cloud-upload";
import FormFieldSet from "../../../../../components/FormFieldSet";
import pdfImg from "@/assets/icons/PDF.png";
import TrashIcon from "@/public/icons/trash";
// import PencilLineIcon from "@/public/icons/pencil-line";
import VisuallyHiddenInput from "@/components/shared/VisuallyHiddenInput";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { apiClient } from "@/config/axios-config";
import { serialize } from "object-to-formdata";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

export default function UploadCvDialog(props: PropsT) {
  // declare and define component state and variables
  const { open, setOpen } = props;
  const { user, handleRefetchDataStatus } = useUserProfileCxt();
  const { handleRefetchUserCV } = useUserAcademicTabsCxt();
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File>();

  // handle side effects
  useEffect(() => {
    setUploadedFile(undefined);
  }, [open]);

  // handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (loading) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
  };

  // handle file upload
  const handleFileUpload = async () => {
    if (!uploadedFile) return;
    try {
      await apiClient.post(
        `/biographies`,
        serialize({
          file: uploadedFile,
          user_id: user?.user_id,
        })
      );
      setOpen(false);
      handleRefetchUserCV();
      handleRefetchDataStatus();
      setLoading(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            السيرة الذاتية
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* upload cv */}
          <div className="flex flex-col gap-4 items-center justify-center">
            <label className="w-10/12 h-60 p-3 bg-sidebar flex flex-col items-center justify-around text-black cursor-pointer gap-4">
              <CloudUploadIcon additionalClass="w-[70px] h-[70px] text-pink-600" />
              <p className="text-md font-bold text-white">قم بارفاق المستند </p>
              <p className="text-center text-sm text-gray-500">
                يُسمح بتنسيق PDF أو JPG أو PNG، والحجم الأقصى هو 200 ميجابايت
              </p>
              <VisuallyHiddenInput
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />

              <span className="text-white border p-2 rounded-lg bg-pink-600">
                أرفاق
              </span>
            </label>
          </div>
          {/* cv files */}
          {uploadedFile && (
            <div className="flex flex-col items-center justify-center gap-6">
              <FormFieldSet title={"ارفاق السيرة الذاتية"}>
                <UploadedFile
                  file={uploadedFile}
                  setUploadedFile={setUploadedFile}
                />
              </FormFieldSet>
              <Button onClick={handleFileUpload}>تحديث</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const UploadedFile = ({
  file,
  setUploadedFile,
}: {
  file: File;
  setUploadedFile: React.Dispatch<SetStateAction<File | undefined>>;
}) => {
  const truncatedName =
    file.name.length > 20 ? file.name.slice(0, 17) + "..." : file.name;
  const fileSizeKB = (file.size / 1024).toFixed(2);
  const uploadedDate = new Date().toLocaleString();

  return (
    <div className="flex flex-row items-center justify-between gap-4">
      {/* information */}
      <div className="flex flex-col">
        <div className="flex flex-row items-center gap-2">
          <img src={pdfImg.src} alt="pdf" className="w-5 h-5" />
          <p className="text-sm text-white font-bold">{truncatedName}</p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <p className="text-sm text-gray-500">{uploadedDate}</p>
          <p className="text-sm text-gray-500">{fileSizeKB} KB</p>
        </div>
      </div>
      {/* actions */}
      <div>
        <Button variant={"ghost"} onClick={() => setUploadedFile(undefined)}>
          <TrashIcon color="red" />
        </Button>
        {/* <Button variant={"ghost"}>
          <PencilLineIcon additionalClass="text-pink-500" />
        </Button> */}
      </div>
    </div>
  );
};
