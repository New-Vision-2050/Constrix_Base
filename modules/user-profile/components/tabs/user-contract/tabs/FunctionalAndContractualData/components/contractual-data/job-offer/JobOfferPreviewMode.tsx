import { JobOffer } from "@/modules/user-profile/types/job-offer";
import PreviewTextField from "../../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../../context";
import { useTranslations } from "next-intl";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferFormPreviewMode({ offer }: PropsT) {
  const { handleRefetchJobOffer } = useFunctionalContractualCxt();
  const t = useTranslations("UserProfile.tabs.financialData.jobOffer");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("jobOfferNumberLabel")}
          value={offer?.job_offer_number ?? ""}
          valid={Boolean(offer?.job_offer_number)}
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("dateSendLabel")}
          value={offer?.date_send ?? ""}
          valid={Boolean(offer?.date_send)}
          type="date"
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("dateAcceptLabel")}
          value={offer?.date_accept ?? ""}
          valid={Boolean(offer?.date_accept)}
        />
      </div>

      {Array.isArray(offer?.files) && offer?.files?.length > 0 ? (
        offer?.files?.map((media) => (
          <div key={media.id} className="p-2">
            <PreviewTextField
              mediaId={media?.id}
              fireAfterDeleteMedia={() => {
                handleRefetchJobOffer();
              }}
              valid={Boolean(media?.name)}
              label={t("fileLabel")}
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
            label={t("fileLabel")}
            value={"---"}
            type={"pdf"}
          />
        </div>
      )}
    </div>
  );
}
