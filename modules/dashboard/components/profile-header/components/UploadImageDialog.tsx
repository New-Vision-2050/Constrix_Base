import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CloudUploadIcon from "@/public/icons/cloud-upload";
import InfoIcon from "@/public/icons/InfoIcon";
import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import VisuallyHiddenInput from "@/components/shared/VisuallyHiddenInput";
import validateProfileImage from "@/modules/dashboard/api/validate-image";
import { CircleCheckIcon } from "lucide-react";
import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";
import RegularList from "@/components/shared/RegularList";

type PropsT = {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
};

const initallyValidateMgs: ProfileImageMsg[] = [
  { sentence: "حجم الصورة لا يتعدى 5 ميجابايت.", status: -1, sub_title: "" },
  {
    sentence: "اختر الحجم المناسب للصورة (مثل 1920x1080 بكسل).",
    status: -1,
    sub_title: "",
  },
  { sentence: "تأكد من أن الخلفية بيضاء.", status: -1, sub_title: "" },
];

export default function UploadImageDialog({ open, setOpen }: PropsT) {
  const [loading, setLoading] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState(initallyValidateMgs);
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    setFeedbackMessages(initallyValidateMgs);
  };
  // handle upload and validate Image
  const handleValidateImage = async () => {
    try {
      setLoading(true);
      const response = await validateProfileImage(uploadedFile as File);
      setFeedbackMessages(response);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("error in handleValidateImage :", err);
    }
  };

  // handle save image
  const handleSaveImage = async () => {
    console.log("start save image");
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
            onClick={handleValidateImage}
            title={"validate Image"}
            disabled={!Boolean(uploadedFile) || loading}
          >
            التحقق من الصورة
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
