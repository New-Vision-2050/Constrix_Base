import { CompanyLegalData } from "@/modules/company-profile/types/company";
import FieldPreview, {
  PreviewTextFieldType,
} from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { FilePlus } from "lucide-react";

const LegalDataPreview = ({
  companyLegalData,
}: {
  companyLegalData: CompanyLegalData[];
}) => {
  console.log({ companyLegalData });

  const previewData = companyLegalData?.map((obj) => {
    return [
      {
        valid: Boolean(obj?.registration_type),
        label: "نوع التسجل",
        value: obj?.registration_type,
        needRequest: true,
        containerClassName: "col-span-4",
      },
      {
        valid: Boolean(obj?.registration_number),
        label: " رقم السجل التجاري / رقم الـ 700",
        needRequest: true,
        value: obj?.registration_number,
        containerClassName: "col-span-2",
      },
      {
        valid: Boolean(obj?.start_date),
        label: "تاريخ الإصدار",
        type: "date" as PreviewTextFieldType,
        value: obj?.start_date ? new Date(obj.start_date).toLocaleDateString("en-GB") : "",
      },
      {
        valid: Boolean(obj?.end_date),
        label: "تاريخ الانتهاء",
        value: obj?.end_date ? new Date(obj.end_date).toLocaleDateString("en-GB") : "",
        render: () => (
          <div className="flex items-stretch gap-3">
            <FieldPreview
              valid={true}
              label="تاريخ الانتهاء"
              type="date"
              value={obj?.end_date ? new Date(obj.end_date).toLocaleDateString("en-GB") : ""}
            />
            <div className="border shrink-0 border-dashed  flex items-center justify-center w-9 h-11 rounded-md">
              <FilePlus className="w-4 text-[#18CB5F] shrink-0" />
            </div>
          </div>
        ),
      },
    ];
  });

  return (
    <div className="grid grid-cols-4 gap-x-3 gap-y-5 max-h-[500px] overflow-auto">
      {previewData?.flatMap((previewArray, arrayIndex) =>
        previewArray?.map((preview, itemIndex) => (
          <div
            key={`${arrayIndex}-${itemIndex}-${preview.label}`}
            className={preview?.containerClassName}
          >
            {preview?.render ? preview.render() : <FieldPreview {...preview} />}
          </div>
        ))
      )}
    </div>
  );
};

export default LegalDataPreview;