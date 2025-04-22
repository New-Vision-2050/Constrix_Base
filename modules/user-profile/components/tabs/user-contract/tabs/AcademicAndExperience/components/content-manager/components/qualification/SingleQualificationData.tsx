import SingleQualificationDataPreview from "./preview-mode";
import SingleQualificationDataEditMode from "./edit-mode";
import { Qualification } from "@/modules/user-profile/types/qualification";
import TabTemplate from "@/modules/user-profile/components/TabTemplate";
import { apiClient } from "@/config/axios-config";
import { useUserAcademicTabsCxt } from "../UserAcademicTabsCxt";
import { useTranslations } from "next-intl";

type PropsT = { qualification: Qualification };
export default function SingleQualificationData({ qualification }: PropsT) {
  const t = useTranslations("GeneralActions");
  const tCompanies = useTranslations("Companies");
  // declare and define component state and vars
  const { handleRefreshUserQualifications } = useUserAcademicTabsCxt();

  // declare and define component methods
  const handleDelete = async () => {
    await apiClient
      .delete(`/qualifications/${qualification?.id}`)
      .then(() => {
        handleRefreshUserQualifications();
      })
      .catch((err) => {
        console.log("delete bank error", err);
      });
  };

  // return component ui
  return (
    <TabTemplate
      title={""}
      reviewMode={
        <SingleQualificationDataPreview qualification={qualification} />
      }
      editMode={
        <SingleQualificationDataEditMode qualification={qualification} />
      }
      settingsBtn={{
        items: [
          { title: t("MyRequests"), onClick: () => {} },
          { title: t("CreateRequest"), onClick: () => {} },
          {
            title: tCompanies("Delete"),
            onClick: () => {
              handleDelete();
            },
          },
        ],
      }}
    />
  );
}
