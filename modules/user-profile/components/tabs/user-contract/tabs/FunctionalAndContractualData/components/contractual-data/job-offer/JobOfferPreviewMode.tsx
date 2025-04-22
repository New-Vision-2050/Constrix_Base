import { JobOffer } from "@/modules/user-profile/types/job-offer";
import PreviewTextField from "../../../../components/previewTextField";
import { useTranslations } from "next-intl";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferFormPreviewMode({ offer }: PropsT) {
  const t = useTranslations("JobOffer");
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label={t("OfferNumber")}
          value={offer?.job_offer_number ?? ""}
          valid={Boolean(offer?.job_offer_number)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("SendDate")}
          value={offer?.date_send ?? ""}
          valid={Boolean(offer?.date_send)}
          type="date"
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("ApprovalDate")}
          value={offer?.date_accept ?? ""}
          valid={Boolean(offer?.date_accept)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label={t("AttachOffer")}
          value={offer?.job_offer_number??''}
          valid={Boolean(offer?.job_offer_number)}
          required
        />
      </div>
    </div>
  );
}
