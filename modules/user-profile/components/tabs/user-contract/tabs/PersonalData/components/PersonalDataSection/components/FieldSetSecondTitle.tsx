import { Button } from "@/components/ui/button";
import EyeIcon from "@/public/icons/eye-icon";
import PencilLineIcon from "@/public/icons/pencil-line";
import SettingsIcon from "@/public/icons/settings";

type PropsT = {
  mode: "Edit" | "Preview";
  handleEditClick: () => void;
};
export default function FieldSetSecondTitle(props: PropsT) {
  const { mode, handleEditClick } = props;

  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant={"ghost"}>
        <SettingsIcon />
      </Button>
      <Button variant={"ghost"} onClick={handleEditClick}>
        {mode === "Preview" ? (
          <PencilLineIcon additionalClass="text-pink-600" />
        ) : (
          <EyeIcon />
        )}
      </Button>
    </div>
  );
}
