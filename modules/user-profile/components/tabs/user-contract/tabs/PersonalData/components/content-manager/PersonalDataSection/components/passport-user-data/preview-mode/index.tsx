import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useTranslations } from "next-intl";

export default function UserProfilePassportDataReview() {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.nestedTabs.passportData");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.passport)}
          label={t("passportNumber")}
          value={userIdentityData?.passport ?? ""}
          required
          enableCopy
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.passport_start_date)}
          label={t("passportStartDate")}
          value={userIdentityData?.passport_start_date ?? ""}
          required
          type="date"
        />
      </div>

      {/* second row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.passport_end_date)}
          label={t("passportEndDate")}
          value={userIdentityData?.passport_end_date ?? ""}
          type="date"
          required
        />
      </div>
      {Array.isArray(userIdentityData?.file_passport) &&
      userIdentityData?.file_passport?.length > 0 ? (
        userIdentityData?.file_passport?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefreshIdentityData();
              }}
              valid={Boolean(media?.name)}
              label={t("passportFile")}
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
            label={t("passportFile")}
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
