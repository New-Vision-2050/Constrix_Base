import {
  DropdownItemT,
  IconBtnDropdown,
} from "@/components/shared/IconBtnDropdown";
import { Button } from "@/components/ui/button";
import EyeIcon from "@/public/icons/eye-icon";
import PencilLineIcon from "@/public/icons/pencil-line";
import SettingsIcon from "@/public/icons/settings";

type PropsT = {
  mode: "Edit" | "Preview";
  handleEditClick: () => void;
  settingsBtn?: {
    icon?: JSX.Element;
    items: DropdownItemT[];
  };
};
export default function FieldSetSecondTitle(props: PropsT) {
  const { mode, handleEditClick, settingsBtn } = props;

  return (
    <div className="flex items-center justify-center gap-1">
      <IconBtnDropdown
        icon={settingsBtn?.icon ?? <SettingsIcon />}
        items={settingsBtn?.items ?? []}
      />
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
