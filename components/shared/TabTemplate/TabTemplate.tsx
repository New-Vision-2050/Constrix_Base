import { useEffect, useState } from "react";
import FormFieldSet from "../../../modules/user-profile/components/tabs/user-contract/tabs/components/FormFieldSet";
import FieldSetSecondTitle from "../../../modules/user-profile/components/tabs/user-contract/tabs/components/FieldSetSecondTitle";
import { DropdownItemT } from "@/components/shared/IconBtnDropdown";
import { TabTemplateLoading } from "./TabTemplateLoading";

type PropsT = {
  title: string;
  loading?: boolean;
  editMode: React.ReactNode;
  reviewMode: React.ReactNode;
  onChangeMode?: () => void;
  settingsBtn?: {
    icon?: JSX.Element;
    items: DropdownItemT[];
  };
  canEdit?: boolean;
};

export default function TabTemplate(props: PropsT) {
  // declare and define helper state and variables
  const {
    title,
    reviewMode,
    editMode,
    onChangeMode,
    settingsBtn,
    loading = false,
    canEdit = true,
  } = props;
  const [mode, setMode] = useState<"Preview" | "Edit">("Preview");

  // handle side effects
  useEffect(() => {
    if (mode === "Preview") onChangeMode?.();
  }, [mode, onChangeMode]);

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
          canEdit={canEdit}
        />
      }
    >
      {loading ? (
        <TabTemplateLoading />
      ) : mode === "Preview" ? (
        reviewMode
      ) : (
        <> { canEdit && editMode } </>
      )}
    </FormFieldSet>
  );
}
