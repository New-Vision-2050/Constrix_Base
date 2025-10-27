import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useTranslations } from "next-intl";

export default function UserIqamaDataPreviewMode() {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.nestedTabs.iqamaData");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label={t("iqamaNumber")}
          required
          enableCopy
          value={userIdentityData?.entry_number ?? ""}
          valid={Boolean(userIdentityData?.entry_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("iqamaStartDate")}
          required
          value={userIdentityData?.entry_number_start_date ?? ""}
          valid={Boolean(userIdentityData?.entry_number_start_date)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("iqamaEndDate")}
          required
          value={userIdentityData?.entry_number_end_date ?? ""}
          valid={Boolean(userIdentityData?.entry_number_end_date)}
          type="date"
        />
      </div>

      {Array.isArray(userIdentityData?.file_entry_number) &&
      userIdentityData?.file_entry_number?.length > 0 ? (
        userIdentityData?.file_entry_number?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefreshIdentityData();
              }}
              valid={Boolean(media?.name)}
              label={t("iqamaAttachment")}
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
            label={t("iqamaAttachment")}
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
