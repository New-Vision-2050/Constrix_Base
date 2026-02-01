import { FormConfig } from "@/modules/form-builder";
import { serialize } from "object-to-formdata";
import { useUserProfileCxt } from "@/modules/user-profile/context/user-profile-cxt";
import { useFunctionalContractualCxt } from "../../../context";
import { JobOffer } from "@/modules/user-profile/types/job-offer";
import { formatDateYYYYMMDD } from "@/utils/format-date-y-m-d";
import { defaultSubmitHandler } from "@/modules/form-builder/utils/defaultSubmitHandler";
import { useTranslations } from "next-intl";

type PropsT = {
  offer?: JobOffer;
};

export const JobOfferFormConfig = ({ offer }: PropsT) => {
  const { userId } = useUserProfileCxt();
  const { handleRefetchJobOffer } = useFunctionalContractualCxt();
  const t = useTranslations("UserProfile.tabs.financialData.jobOffer");

  const jobOfferFormConfig: FormConfig = {
    formId: `job-offer-data-form-${offer?.id}`,
    sections: [
      {
        fields: [
          {
            name: "job_offer_number",
            label: t("jobOfferNumberLabel"),
            type: "text",
            placeholder: t("jobOfferNumberPlaceholder"),
            validation: [],
          },
          {
            label: t("dateSendLabel"),
            type: "date",
            name: "date_send",
            placeholder: t("dateSendPlaceholder"),
            maxDate: {
              formId: `job-offer-data-form-${offer?.id}`,
              field: "date_accept",
            },
            validation: [],
          },
          {
            label: t("dateAcceptLabel"),
            type: "date",
            name: "date_accept",
            placeholder: t("dateAcceptPlaceholder"),
            minDate: {
              formId: `job-offer-data-form-${offer?.id}`,
              field: "date_send",
            },
            validation: [],
          },
          {
            label: t("fileLabel"),
            type: "file",
            fileConfig: {
              allowedFileTypes: [
                "application/pdf", // pdf
                "image/jpeg", // jpeg & jpg
                "image/png", // png
              ],
            },
            name: "file",
            isMulti: true,
            placeholder: t("filePlaceholder"),
          },
        ],
      },
    ],
    initialValues: {
      job_offer_number: offer?.job_offer_number,
      date_send: offer?.date_send,
      date_accept: offer?.date_accept,
      file: offer?.files,
    },
    submitButtonText: t("save"),
    cancelButtonText: t("cancel"),
    showReset: false,
    resetButtonText: "Clear Form",
    showSubmitLoader: true,
    resetOnSuccess: false,
    showCancelButton: false,
    showBackButton: false,
    onSuccess: () => {
      handleRefetchJobOffer();
    },
    onSubmit: async (formData: Record<string, unknown>) => {
      const dateSend = new Date(formData?.date_send as string);
      const dateAccept = new Date(formData?.date_accept as string);

      //job_offer_number,date_send,date_accept,file,user_id

      const body = {
        ...formData,
        user_id: userId,
        date_send: formatDateYYYYMMDD(dateSend),
        date_accept: formatDateYYYYMMDD(dateAccept),
      };

      return await defaultSubmitHandler(serialize(body), jobOfferFormConfig, {
        url: `/job_offers`,
        method: "POST",
      });
    },
  };
  return jobOfferFormConfig;
};
