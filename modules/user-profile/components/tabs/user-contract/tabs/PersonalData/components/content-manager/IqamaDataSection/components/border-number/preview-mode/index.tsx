import { checkString } from "@/utils/check-string";
import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useTranslations } from "next-intl";

export default function UserIqamaBorderNumberPreviewMode() {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.nestedTabs.borderNumberData");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label={t("borderNumber")}
          required
          enableCopy
          value={checkString(userIdentityData?.border_number as string)}
          valid={Boolean(userIdentityData?.border_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("borderNumberStartDate")}
          value={checkString(
            userIdentityData?.border_number_start_date as string
          )}
          valid={Boolean(userIdentityData?.border_number_start_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          required
          label={t("borderNumberEndDate")}
          value={checkString(
            userIdentityData?.border_number_end_date as string
          )}
          valid={Boolean(userIdentityData?.border_number_end_date)}
          type="date"
        />
      </div>

      {Array.isArray(userIdentityData?.file_border_number) &&
      userIdentityData?.file_border_number?.length > 0 ? (
        userIdentityData?.file_border_number?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefreshIdentityData();
              }}
              valid={Boolean(media?.name)}
              label={t("borderNumberAttachment")}
              value={media?.name ?? "---"}
              type={media?.type == "image" ? "image" : "pdf"}
              fileUrl={media?.url}
            />
          </div>
        ))
      ) : (
        <div className="p-2">
          <PreviewTextField
            valid={false}
            label={t("borderNumberAttachment")}
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
