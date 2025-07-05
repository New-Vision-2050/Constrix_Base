import { checkString } from "@/utils/check-string";
import PreviewTextField from "../../../../../../../components/previewTextField";
import { usePersonalDataTabCxt } from "../../../../../../context/PersonalDataCxt";

export default function UserIqamaBorderNumberPreviewMode() {
  const { userIdentityData, handleRefreshIdentityData } =
    usePersonalDataTabCxt();

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* First row */}
      <div className="p-2">
        <PreviewTextField
          label="رقم الحدود"
          required
          enableCopy
          value={checkString(userIdentityData?.border_number as string)}
          valid={Boolean(userIdentityData?.border_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الدخول"
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
          label="تاريخ الانتهاء"
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
              label="ارفاق رقم الحدود"
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
            label="ارفاق رقم الحدود"
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
