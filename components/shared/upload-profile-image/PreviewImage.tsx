import { Button } from "@/components/ui/button";

type PropsT = {
  loading: boolean;
  previewUrl: string;
  handleClearImage: () => void;
};

export default function PreviewImage(props: PropsT) {
  const { loading, previewUrl, handleClearImage } = props;

  return (
    <div className="w-80 h-60 bg-sidebar flex gap-4 flex-col items-center justify-around">
      <img
        src={previewUrl}
        alt="Preview"
        className="w-44 max-h-[150px] h-auto rounded-xl"
      />
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
