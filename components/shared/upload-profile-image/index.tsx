import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";

import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";

import UploadProfileImageDialogHeader from "./UploadProfileImageDialogHeader";
import ShowFeedbackMessages from "./ShowFeedbackMessages";
import PreviewImage from "./PreviewImage";
import PlaceholderImage from "./PlaceholderImage";

// Props type
type PropsT = {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  validateImageFn(image: File): Promise<ProfileImageMsg[]>; // external image validation logic
  uploadImageFn(image: File): Promise<{ image_url: string }>; // external upload logic
};

// initial validation messages to display before upload
const initialValidateMgs: ProfileImageMsg[] = [
  { sentence: "حجم الصورة لا يتعدى 5 ميجابايت.", status: -1, sub_title: "" },
  {
    sentence: "اختر الحجم المناسب للصورة (مثل 1920x1080 بكسل).",
    status: -1,
    sub_title: "",
  },
  { sentence: "تأكد من أن الخلفية بيضاء.", status: -1, sub_title: "" },
];

export default function UploadProfileImageDialog({
  title,
  open,
  setOpen,
  validateImageFn,
  uploadImageFn,
}: PropsT) {
  // declare and define component state and vars
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState(initialValidateMgs);
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // access user profile updater
  const { handleUpdateImage } = useUserProfileCxt();

  // reset dialog state when opened
  useEffect(() => {
    setValid(false);
    setPreviewUrl("");
    setFeedbackMessages(initialValidateMgs);
  }, [open]);

  // handle file input changes and preview image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedFile(file);
  };

  // reset the image state
  const handleClearImage = () => {
    setPreviewUrl(null);
    setValid(false);
    setUploadedFile(undefined);
    setFeedbackMessages(initialValidateMgs);
  };

  // run validation function passed via props
  const handleValidateImage = async () => {
    if (!uploadedFile) return;

    try {
      setLoading(true);
      const response = await validateImageFn(uploadedFile);

      // check validity by ensuring all messages have status = 1
      const isValid = response.every((msg) => msg.status === 1);

      setValid(isValid);
      setFeedbackMessages(response);
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // upload image and trigger user context update
  const handleSaveImage = async () => {
    try {
      setLoading(true);
      const response = await uploadImageFn(uploadedFile as File);
      handleUpdateImage(response.image_url);
      setOpen(false);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <UploadProfileImageDialogHeader title={title} />

        {/* Content section with upload instructions and file input UI */}
        <div className="flex justify-around gap-8">
          {/* Instructional text section */}
          <ShowFeedbackMessages messages={feedbackMessages} />

          {/* Upload UI section */}
          {!previewUrl && (
            <PlaceholderImage handleFileChange={handleFileChange} />
          )}

          {/* Preview Uploaded Image */}
          {previewUrl && (
            <PreviewImage
              loading={loading}
              previewUrl={previewUrl}
              handleClearImage={handleClearImage}
            />
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
