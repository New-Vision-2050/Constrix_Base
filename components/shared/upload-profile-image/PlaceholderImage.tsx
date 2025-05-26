import { useTranslations } from "next-intl";
import VisuallyHiddenInput from "../VisuallyHiddenInput";
import { CloudUpload } from "lucide-react";

type PropsT = {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PlaceholderImage({ handleFileChange }: PropsT) {
  const t = useTranslations("UserProfile.header.uploadPhoto.actions");
  return (
    <label className="w-80 h-60 bg-sidebar flex flex-col items-center rounded-2xl justify-around cursor-pointer ">
      <CloudUpload size={50} />

      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <span className="w-32 text-center border p-2 rounded-lg border-pink-600">
        {t("attachmentLabel")}
      </span>
    </label>
  );
}
