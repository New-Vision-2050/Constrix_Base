import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";

import UploadProfileImageDialogHeader from "./UploadProfileImageDialogHeader";
import ShowFeedbackMessages from "./ShowFeedbackMessages";
import ImageUploadWithCrop from "@/components/shared/image-upload-with-crop";
import { useTranslations } from "next-intl";
import { ValidCompanyProfileImage } from "@/modules/company-profile/types/valdation-message-company-image";

// Props type
type PropsT = {
  title?: string;
  open: boolean;
  onSuccess?: (url: string) => void;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  validateImageFn(
    image: File,
  ): Promise<ProfileImageMsg[] | ValidCompanyProfileImage[]>; // external image validation logic
  uploadImageFn(image: File): Promise<{ image_url: string }>; // external upload logic
};

// initial validation messages to display before upload
export const getInitialValidateMsgs = (t: (key: string) => string) => [
  { sentence: t("rules.rule1"), status: -1, sub_title: "" },
  { sentence: t("rules.rule2"), status: -1, sub_title: "" },
  { sentence: t("rules.rule3"), status: -1, sub_title: "" },
];

export default function UploadProfileImageDialog({
  title,
  open,
  setOpen,
  onSuccess,
  validateImageFn,
  uploadImageFn,
}: PropsT) {
  // declare and define component state and vars
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("UserProfile.header.uploadPhoto");
  const [feedbackMessages, setFeedbackMessages] = useState(
    getInitialValidateMsgs(t),
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [croppedImageBase64, setCroppedImageBase64] = useState<string | null>(
    null,
  );

  // reset dialog state when opened
  useEffect(() => {
    setValid(false);
    setUploadedFile(null);
    setCroppedImageBase64(null);
    setFeedbackMessages(getInitialValidateMsgs(t));
  }, [open, t]);

  // handle cropped image from ImageUploadWithCrop
  const handleImageCropped = (file: File | null, base64: string | null) => {
    setUploadedFile(file);
    setCroppedImageBase64(base64);
    // Reset validation when new image is selected
    setValid(false);
    setFeedbackMessages(getInitialValidateMsgs(t));
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
      onSuccess?.(response?.image_url);
      setOpen(false);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <UploadProfileImageDialogHeader title={title} />

        {/* Content section with upload instructions and file input UI */}
        <div className="flex justify-around gap-8 items-start">
          {/* Instructional text section */}
          <ShowFeedbackMessages messages={feedbackMessages} />

          {/* Image Upload with Crop */}
          <ImageUploadWithCrop
            onChange={handleImageCropped}
            loading={loading}
            previewImage={croppedImageBase64}
            disabled={false}
            cropOptions={{
              minWidth: 100,
              aspect: 16 / 9,
            }}
          />
        </div>

        {/* Dialog Actions Buttons */}
        <div className="w-full flex justify-center items-center">
          <Button
            onClick={!valid ? handleValidateImage : handleSaveImage}
            title={
              !valid
                ? !uploadedFile
                  ? t("actions.title.upload")
                  : t("actions.title.validate")
                : t("actions.title.save")
            }
            disabled={!Boolean(uploadedFile) || loading}
          >
            {!valid
              ? loading
                ? t("actions.loadingLabel")
                : t("actions.checkLabel")
              : loading
                ? t("actions.loadingLabel")
                : t("actions.saveLabel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
