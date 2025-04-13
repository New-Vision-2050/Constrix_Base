import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CloudUploadIcon from "@/public/icons/cloud-upload";
import InfoIcon from "@/public/icons/InfoIcon";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import VisuallyHiddenInput from "@/components/shared/VisuallyHiddenInput";
import validateProfileImage from "@/modules/dashboard/api/validate-image";
import { CircleCheckIcon } from "lucide-react";
import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";
import RegularList from "@/components/shared/RegularList";
import uploadProfileImage from "@/modules/dashboard/api/upload-profile-image";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

const initialValidateMgs: ProfileImageMsg[] = [
  { sentence: "حجم الصورة لا يتعدى 5 ميجابايت.", status: -1, sub_title: "" },
  {
    sentence: "اختر الحجم المناسب للصورة (مثل 1920x1080 بكسل).",
    status: -1,
    sub_title: "",
  },
  { sentence: "تأكد من أن الخلفية بيضاء.", status: -1, sub_title: "" },
];

export default function UploadImageDialog({ open, setOpen }: PropsT) {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState(initialValidateMgs);
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { handleUpdateImage } = useUserProfileCxt();

  // handle side effects
  useEffect(() => {
    setValid(false);
    setPreviewUrl("");
    setFeedbackMessages(initialValidateMgs);
  }, [open]);

  // handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedFile(file);
  };

  // handle clear image
  const handleClearImage = () => {
    setPreviewUrl(null);
    setValid(false);
    setUploadedFile(undefined);
    setFeedbackMessages(initialValidateMgs);
  };

  // handle upload and validate Image
  const handleValidateImage = async () => {
    try {
      if (!uploadedFile) {
        return;
      }
      setLoading(true);
      const response = await validateProfileImage(uploadedFile as File);
      let _valid = true;
      for (let i = 0; i < response.length; i++) {
        if (response[i].status !== 1) {
          _valid = false;
          break;
        }
      }
      setValid(_valid);
      setFeedbackMessages(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error in handleValidateImage :", err);
    }
  };

  // handle save image
  const handleSaveImage = async () => {
    try {
      setLoading(true);
      const response = await uploadProfileImage(uploadedFile as File);
      handleUpdateImage(response?.image_url);
      setLoading(false);
      setOpen(false);
    } catch (err) {
      setLoading(false);
      console.log("error in handleValidateImage :", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">اضافة صورة</DialogTitle>
        </DialogHeader>

        {/* Content section with upload instructions and file input UI */}
        <div className="flex justify-around gap-8">
          {/* Instructional text section */}
          <div className="flex flex-col gap-4">
            <RegularList<ProfileImageMsg, "feedback">
              items={feedbackMessages}
              sourceName="feedback"
              ItemComponent={DialogTextInfo}
              keyPrefix="user-image-validation"
            />
          </div>

          {/* Upload UI section */}
          {!previewUrl && (
            <label className="w-40 h-40 bg-sidebar flex flex-col items-center justify-around text-black cursor-pointer gap-4">
              <CloudUploadIcon additionalClass="text-2xl text-white" />

              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              <span className="text-white border p-2 rounded-lg border-pink-600">
                أرفاق
              </span>
            </label>
          )}

          {/* Preview Uploaded Image */}
          {previewUrl && (
            <div className="flex gap-4 flex-col items-center justify-around">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-40 h-36 h-auto rounded-lg"
              />
              <Button
                variant={"outline"}
                disabled={loading}
                onClick={handleClearImage}
              >
                Clear Image
              </Button>
            </div>
          )}
        </div>

        {/* Dialog Actions Buttons */}
        <div className="w-full flex justify-center items-center">
          <Button
            onClick={!valid ? handleValidateImage : handleSaveImage}
            title={
              !valid
                ? !uploadedFile
                  ? "upload image firstly"
                  : "validate Image"
                : "Save Image"
            }
            disabled={!Boolean(uploadedFile) || loading}
          >
            {!valid
              ? loading
                ? "جاري التنفيذ..."
                : "التحقق من الصورة"
              : loading
              ? "جاري التنفيذ..."
              : "حفظ"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Reusable component to display icon with informational text
const DialogTextInfo = ({ feedback }: { feedback: ProfileImageMsg }) => {
  return (
    <div className="flex gap-1">
      {feedback?.status === 1 ? (
        <CircleCheckIcon color="green" />
      ) : (
        <InfoIcon additionClass="text-orange-400" />
      )}
      <p className="text-md">{feedback.sentence}</p>
    </div>
  );
};
