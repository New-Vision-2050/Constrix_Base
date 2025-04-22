import PreviewTextField from "../../../components/previewTextField";

export default function JobInformationPreviewMode() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-2">
        <PreviewTextField
          label="الفرع"
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="الادارة"
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="القسم"
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="نوع الوظيفة"
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="المسمى الوظيفي"
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>

      <div className="p-2">
        <PreviewTextField
          label="الرقم الوظيفي"
          value={"offer?.job_offer_number"}
          valid={Boolean("offer?.job_offer_number")}
          required
        />
      </div>
    </div>
  );
}
