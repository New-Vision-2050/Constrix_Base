import { Relative } from "@/modules/user-profile/types/relative";
import PreviewTextField from "../../../../../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = {
  relative: Relative;
};

export default function MaritalStatusRelativesSectionPreviewMode({
  relative,
}: PropsT) {
  const isNotMarried = relative?.marital_status?.type === "not-married";
  const t = useTranslations("UserProfile.nestedTabs.maritalStatusRelatives");
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row one columns*/}
      <div className="p-2 col-span-2">
        <PreviewTextField
          label={t("maritalStatus")}
          value={relative?.marital_status?.name}
          valid={Boolean(relative?.marital_status?.name)}
          type="select"
        />
      </div>
      {/* two row 2 columns*/}
      {!isNotMarried && (
        <>
          <div className="p-2">
            <PreviewTextField
              label={t("relativeName")}
              value={relative?.name}
              valid={Boolean(relative?.name)}
            />
          </div>
          <div className="p-2">
            <PreviewTextField
              label={t("relationship")}
              value={relative?.relationship}
              valid={Boolean(relative?.relationship)}
            />
          </div>
        </>
      )}
      {/* third row one columns*/}
      {!isNotMarried && (
        <div className="p-2 col-span-2">
          <PreviewTextField
            label={t("phone")}
            value={relative?.phone}
            valid={Boolean(relative?.phone)}
          />
        </div>
      )}
    </div>
  );
}
