import CloudUploadIcon from "@/public/icons/cloud-upload";
import VisuallyHiddenInput from "../VisuallyHiddenInput";

type PropsT = {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PlaceholderImage({ handleFileChange }: PropsT) {
  return (
    <label className="w-80 h-60 bg-sidebar flex flex-col items-center rounded-2xl justify-around text-black cursor-pointer gap-4">
      <CloudUploadIcon additionalClass="text-2xl text-white" />

      <VisuallyHiddenInput
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      <span className="text-white w-32 text-center border p-2 rounded-lg border-pink-600">
        أرفاق
      </span>
    </label>
  );
}
