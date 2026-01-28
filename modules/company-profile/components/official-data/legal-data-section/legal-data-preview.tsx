import { CompanyLegalData } from "@/modules/company-profile/types/company";
import FieldPreview, {
  PreviewTextFieldType,
} from "@/modules/user-profile/components/tabs/user-contract/tabs/components/previewTextField";
import { FilePlus } from "lucide-react";
import { RegistrationTypes } from "./registration-types";
import { useTranslations } from "next-intl";

const LegalDataPreview = ({
  companyLegalData,
}: {
  companyLegalData: CompanyLegalData[];
}) => {
  const t = useTranslations("companyProfile");
  console.log("companyLegalData", { companyLegalData });
  const previewData = companyLegalData?.map((obj) => {
    const showRegisterNumber =
      obj?.registration_type_type != RegistrationTypes.WithoutARegister;
    return [
      {
        valid: Boolean(obj?.registration_type),
        label: t("header.placeholder.RegistrationType"),
        value: obj?.registration_type,
        needRequest: true,
        containerClassName: "col-span-4",
        show: true,
      },
      {
        valid: Boolean(obj?.registration_number),
        label: t("header.placeholder.RegistrationNumber"),
        needRequest: true,
        value: obj?.registration_number,
        containerClassName: "col-span-2",
        show: showRegisterNumber,
      },
      {
        valid: Boolean(obj?.start_date),
        label: t("header.placeholder.IssueDate"),
        type: "date" as PreviewTextFieldType,
        value: obj?.start_date
          ? new Date(obj.start_date).toLocaleDateString("en-GB")
          : "",
        containerClassName: !showRegisterNumber ? "col-span-2" : "",
        show: true,
      },
      {
        valid: Boolean(obj?.end_date),
        label: t("header.placeholder.ExpiryDate"),
        value: obj?.end_date
          ? new Date(obj.end_date).toLocaleDateString("en-GB")
          : "",
        containerClassName: !showRegisterNumber ? "col-span-2" : "",
        render: () => (
          <div className="flex items-stretch gap-3">
            <FieldPreview
              valid={true}
              label={t("header.placeholder.ExpiryDate")}
              type="date"
              value={
                obj?.end_date
                  ? new Date(obj.end_date).toLocaleDateString("en-GB")
                  : ""
              }
            />
            <div className="border shrink-0 border-dashed  flex items-center justify-center w-9 h-11 rounded-md">
              <FilePlus className="w-4 text-[#18CB5F] shrink-0" />
            </div>
          </div>
        ),
        show: true,
      },
    ]?.filter((item) => item.show);
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
