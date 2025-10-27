import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";
import { useTranslations } from "next-intl";

export default function UserProfileIdentityDataReview() {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();
  const t = useTranslations("UserProfile.nestedTabs.identityData");

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.identity)}
          label={t("nationalId")}
          enableCopy
          value={userIdentityData?.identity ?? ""}
          required
        />
      </div>
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.identity_start_date)}
          label={t("identityStartDate")}
          value={userIdentityData?.identity_start_date ?? ""}
          required
          type="date"
        />
      </div>

      {/* second row */}
      <div className="p-2">
        <PreviewTextField
          valid={Boolean(userIdentityData?.identity_end_date)}
          label={t("identityEndDate")}
          value={userIdentityData?.identity_end_date ?? ""}
          type="date"
          required
        />
      </div>

      {Array.isArray(userIdentityData?.file_identity) &&
      userIdentityData?.file_identity?.length > 0 ? (
        userIdentityData?.file_identity?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefreshIdentityData();
              }}
              valid={Boolean(media?.name)}
              label={t("identityFile")}
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
            label={t("identityFile")}
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
