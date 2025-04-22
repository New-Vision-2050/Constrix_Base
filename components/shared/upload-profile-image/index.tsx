import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { ProfileImageMsg } from "@/modules/dashboard/types/valdation-message-user-image";

import UploadProfileImageDialogHeader from "./UploadProfileImageDialogHeader";
import ShowFeedbackMessages from "./ShowFeedbackMessages";
import PreviewImage from "./PreviewImage";
import PlaceholderImage from "./PlaceholderImage";
import { useTranslations } from "next-intl";

// Props type
type PropsT = {
  title?: string;
  open: boolean;
  onSuccess?: (url: string) => void;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  validateImageFn(image: File): Promise<ProfileImageMsg[]>; // external image validation logic
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
    getInitialValidateMsgs(t)
  );
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // access user profile updater

  // reset dialog state when opened
  useEffect(() => {
    setValid(false);
    setPreviewUrl("");
    setFeedbackMessages(getInitialValidateMsgs(t));
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
