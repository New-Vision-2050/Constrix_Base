import { Button } from "@/components/ui/button";
import Image from "next/image";

type PropsT = {
  loading: boolean;
  previewUrl: string;
  handleClearImage: () => void;
};

export default function PreviewImage(props: PropsT) {
  const { loading, previewUrl, handleClearImage } = props;

  return (
    <div className="w-80 h-60 bg-sidebar flex gap-4 flex-col items-center justify-around">
      <div className="relative w-44 h-[150px] flex items-center justify-center">
        <Image
          src={previewUrl}
          alt="Preview"
          width={176}
          height={150}
          className="max-h-[150px] rounded-xl object-contain"
        />
      </div>
      <Button
        variant={"outline"}
        disabled={loading}
        onClick={handleClearImage}
        className="border-pink-600 w-32"
      >
        Clear
      </Button>
    </div>
  );
}
