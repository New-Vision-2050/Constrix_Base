import { JobOffer } from "@/modules/user-profile/types/job-offer";
import PreviewTextField from "../../../../components/previewTextField";
import { useFunctionalContractualCxt } from "../../../context";

type PropsT = {
  offer: JobOffer | undefined;
};
export default function JobOfferFormPreviewMode({ offer }: PropsT) {
  const { handleRefetchJobOffer } = useFunctionalContractualCxt();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="رقم العرض"
          value={offer?.job_offer_number ?? ""}
          valid={Boolean(offer?.job_offer_number)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الارسال"
          value={offer?.date_send ?? ""}
          valid={Boolean(offer?.date_send)}
          type="date"
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="تاريخ الموافقة"
          value={offer?.date_accept ?? ""}
          valid={Boolean(offer?.date_accept)}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          mediaId={offer?.files?.id}
          fireAfterDeleteMedia={() => {
            handleRefetchJobOffer();
          }}
          valid={Boolean(offer?.files?.url)}
          label="ارفاق العرض"
          value={offer?.files?.name ?? "---"}
          type={offer?.files?.type == "image" ? "image" : "pdf"}
          fileUrl={offer?.files?.url ?? ""}
        />
      </div>
    </div>
  );
}
