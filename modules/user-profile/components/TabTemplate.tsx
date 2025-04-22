import { useEffect, useState } from "react";
import FormFieldSet from "./tabs/user-contract/tabs/components/FormFieldSet";
import FieldSetSecondTitle from "./tabs/user-contract/tabs/components/FieldSetSecondTitle";
import { DropdownItemT } from "@/components/shared/IconBtnDropdown";

type PropsT = {
  title: string;
  editMode: React.ReactNode;
  reviewMode: React.ReactNode;
  onChangeMode?: () => void;
  settingsBtn?: {
    icon?: JSX.Element;
    items: DropdownItemT[];
  };
};

export default function TabTemplate(props: PropsT) {
  // declare and define helper state and variables
  const { title, reviewMode, editMode, onChangeMode, settingsBtn } = props;
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // handle side effects
  useEffect(() => {
    if (mode === "Preview") onChangeMode?.();
  }, [mode]);

  // declare and define component methods
  const handleEditClick = () =>
    setMode((prev) => (prev === "Preview" ? "Edit" : "Preview"));

  // return component ui
  return (
    <FormFieldSet
      title={title}
      secondTitle={
        <FieldSetSecondTitle
          mode={mode}
          handleEditClick={handleEditClick}
          settingsBtn={settingsBtn}
        />
      }
    >
      {mode === "Preview" ? reviewMode : editMode}
    </FormFieldSet>
  );
}
